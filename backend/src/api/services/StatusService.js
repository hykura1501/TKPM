const StatusRepository = require('../repositories/StatusRepository');
const StudentRepository = require('../repositories/StudentRepository');
const { addLogEntry } = require('../helpers/logging');
const { z } = require('zod');
const mapper = require('../helpers/Mapper');
const { SUPPORTED_LOCALES } = require('../../configs/locales');

const statusSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Tên không được để trống" }),
  color: z.string(),
});

class StatusService {
  async getListStatuses(language = "vi") {
    const statuses = await StatusRepository.findAll();
    const mappedStatuses = statuses.map((status) => mapper.formatStatus(status, language));
    return mappedStatuses;
  }

  async addStatus(data, language = "vi") {
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm tình trạng sinh viên không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newId = await StatusRepository.getNextId();
    const newStatus = { name: new Map(), id: newId };
    SUPPORTED_LOCALES.forEach((locale) => {
      newStatus.name.set(locale, parsed.data.name);
    });
    newStatus.color = parsed.data.color;
    newStatus.allowedStatus = parsed.data.allowedStatus || [];

    await StatusRepository.create(newStatus);
    const statuses = (await StatusRepository.findAll()).map((status) => mapper.formatStatus(status, language))
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

  async updateStatus(data, language = "vi") {
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Cập nhật tình trạng sinh viên không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const status = await StatusRepository.findOneByCondition({ id: parsed.data.id });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }

    status.name.set(language, parsed.data.name);
    status.color = parsed.data.color;
    status.allowedStatus = parsed.data.allowedStatus || [];

    await StatusRepository.update(parsed.data.id, status);
    const statuses = (await StatusRepository.findAll()).map((status) => mapper.formatStatus(status, language))
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

  async deleteStatus(id, language = "vi") {
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
    const statuses = (await StatusRepository.findAll()).map((status) => mapper.formatStatus(status, language))
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
  async findStatusById(id) {
    const status = await StatusRepository.findOneByCondition({ id });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }
    return status;
  }

  async getTranslationStatusById(statusId) {
    if (!statusId) {
      await addLogEntry({ message: "ID tình trạng không được để trống", level: "warn" });
      throw { status: 400, message: "ID tình trạng không được để trống" };
    }

    // Lấy tình trạng từ cơ sở dữ liệu
    const status = await StatusRepository.findOneByCondition({ id: statusId });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }

    // Định dạng dữ liệu bản dịch
    const translations = {
      en: {
        statusName: status.name.get("en"),
      },
      vi: {
        statusName: status.name.get("vi"),
      },
    };

    return translations;
  }

  async updateTranslationStatus(statusId, translations) {
    if (!statusId) {
      await addLogEntry({ message: "ID tình trạng không được để trống", level: "warn" });
      throw { status: 400, message: "ID tình trạng không được để trống" };
    }

    // Lấy tình trạng từ cơ sở dữ liệu
    const status = await StatusRepository.findOneByCondition({ id: statusId });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }

    // Cập nhật bản dịch
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        status.name.set(locale, translations[locale].statusName);
      }
    });

    await StatusRepository.update(statusId, { name: status.name });

    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = new StatusService();