const Status = require('../models/Status');
const { z } = require('zod');
const { addLogEntry } = require('../helpers/logging');

// Define the schema for input validation
const statusSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string(),
});

class StatusController {
  async getListStatuses(req, res) {
    try {
      const statuses = await Status.find({});
      res.status(200).json(statuses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tình trạng sinh viên:", error);
      await addLogEntry({
        message: "Lỗi khi lấy danh sách tình trạng sinh viên",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi lấy danh sách tình trạng sinh viên" });
    }
  }

  async addStatus(req, res) {
    try {
      const parsed = statusSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm tình trạng sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      const newStatus = new Status(parsed.data);
      //Tạo id tự động
      newStatus.id = `status-${Date.now()}`;
      await newStatus.save();
      const statuses = await Status.find({});
      await addLogEntry({
        message: "Thêm tình trạng sinh viên thành công",
        level: "info",
        action: "create",
        entity: "status",
        user: "admin",
        details: "Add new status: " + parsed.data.name,
      });
      res.status(201).json({ message: "Thêm tình trạng sinh viên thành công", statuses: statuses });
    } catch (error) {
      console.error("Lỗi khi thêm tình trạng sinh viên:", error);
      await addLogEntry({
        message: "Lỗi khi thêm tình trạng sinh viên",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi thêm tình trạng sinh viên" });
    }
  }

  async updateStatus(req, res) {
    try {
      const parsed = statusSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật tình trạng sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      await Status.updateOne({ id: parsed.data.id }, { $set: parsed.data });
      const statuses = await Status.find({});
      await addLogEntry({
        message: "Cập nhật tình trạng sinh viên thành công",
        level: "info",
        action: "update",
        entity: "status",
        user: "admin",
        details: "Updated status: " + parsed.data.name,
      });
      res.status(200).json({ message: "Cập nhật tình trạng sinh viên thành công", statuses: statuses });
    } catch (error) {
      console.error("Lỗi khi cập nhật tình trạng sinh viên:", error);
      await addLogEntry({
        message: "Lỗi khi cập nhật tình trạng sinh viên",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi cập nhật tình trạng sinh viên" });
    }
  }

  async deleteStatus(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        await addLogEntry({
          message: "MSSV không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "MSSV không được để trống" });
      }
      //Kiểm tra trạng thái có đang được sử dụng không
      const student = await Student.findOne({ status: id });
      if (student) {
        await addLogEntry({
          message: "Không thể xóa tình trạng sinh viên đang được sử dụng",
          level: "warn",
        });
        return res.status(400).json({ error: "Không thể xóa tình trạng sinh viên đang được sử dụng" });
      }
      await Status.deleteOne({ id });
      const statuses = await Status.find({});
      await addLogEntry({
        message: "Xóa tình trạng sinh viên thành công",
        level: "info",
        action: "delete",
        entity: "status",
        user: "admin",
        details: `Deleted status: ${id}`,
      });
      res.status(200).json({ message: "Xóa tình trạng sinh viên thành công", statuses: statuses });
    } catch (error) {
      console.error("Lỗi khi xóa tình trạng sinh viên:", error);
      await addLogEntry({
        message: "Lỗi khi xóa tình trạng sinh viên",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi xóa tình trạng sinh viên" });
    }
  }
}

module.exports = new StatusController();