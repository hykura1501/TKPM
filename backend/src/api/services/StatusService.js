const StatusRepository = require('../repositories/StatusRepository');
const StudentRepository = require('../repositories/StudentRepository');
const { addLogEntry } = require('../helpers/logging');
const { z } = require('zod');

const statusSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Tên không được để trống" }),
  color: z.string(),
});

class StatusService {
  async getListStatuses() {
    return await StatusRepository.findAll();
  }

  async addStatus(data) {
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm tình trạng sinh viên không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newStatus = { ...parsed.data, id: `status-${Date.now()}` };
    await StatusRepository.create(newStatus);
    const statuses = await StatusRepository.findAll();
    await addLogEntry({
      message: "Thêm tình trạng sinh viên thành công",
      level: "info",
      action: "create",
      entity: "status",
      user: "admin",
      details: "Add new status: " + parsed.data.name,
    });
    return { message: "Thêm tình trạng sinh viên thành công", statuses };
  }

  async updateStatus(data) {
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Cập nhật tình trạng sinh viên không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    await StatusRepository.update(parsed.data.id, parsed.data);
    const statuses = await StatusRepository.findAll();
    await addLogEntry({
      message: "Cập nhật tình trạng sinh viên thành công",
      level: "info",
      action: "update",
      entity: "status",
      user: "admin",
      details: "Updated status: " + parsed.data.name,
    });
    return { message: "Cập nhật tình trạng sinh viên thành công", statuses };
  }

  async deleteStatus(id) {
    if (!id) {
      await addLogEntry({ message: "MSSV không được để trống", level: "warn" });
      throw { status: 400, message: "MSSV không được để trống" };
    }

    const student = await StudentRepository.findOneByCondition({ status: id });
    if (student) {
      await addLogEntry({ message: "Không thể xóa tình trạng sinh viên đang được sử dụng", level: "warn" });
      throw { status: 400, message: "Không thể xóa tình trạng sinh viên đang được sử dụng" };
    }

    await StatusRepository.delete(id);
    const statuses = await StatusRepository.findAll();
    await addLogEntry({
      message: "Xóa tình trạng sinh viên thành công",
      level: "info",
      action: "delete",
      entity: "status",
      user: "admin",
      details: `Deleted status: ${id}`,
    });
    return { message: "Xóa tình trạng sinh viên thành công", statuses };
  }

  async updateStatusRules(statusTransitionsRules) {
    const parsedRules = JSON.parse(statusTransitionsRules);
    for (let rule of parsedRules) {
      await StatusRepository.update(rule.fromStatus, { allowedStatus: rule.toStatus });
    }
    return { message: "Cập nhật quy tắc cho trạng thái thành công" };
  }

  async getStatusRules() {
    const statuses = await StatusRepository.findAll();
    return statuses.map(item => ({ fromStatus: item.id, toStatus: item.allowedStatus }));
  }

  async statusExists(id) {
    const status = await StatusRepository.findOneByCondition({ id });
    return !!status;
  }

}

module.exports = new StatusService();