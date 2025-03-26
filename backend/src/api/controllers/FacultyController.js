const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const { z } = require('zod');
const { addLogEntry } = require('../helpers/logging');

// Define the schema for input validation
const facultySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

// Function to check if a faculty is in use
async function isUse(id) {
  const student = await Student.findOne({ facultyId: id });
  return student ? true : false;
}

class FacultyController {
  async getListFaculties(req, res) {
    try {
      const faculties = await Faculty.find({});
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      await addLogEntry({
        message: "Lỗi khi lấy danh sách khoa",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addFaculty(req, res) {
    try {
      const parsed = facultySchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm khoa không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      const newFaculty = new Faculty(parsed.data);
      //Tạo id tự động
      newFaculty.id = `faculty-${Date.now()}`;
      await newFaculty.save();
      const faculties = await Faculty.find({});
      await addLogEntry({
        message: "Thêm khoa thành công",
        level: "info",
        action: "create",
        entity: "faculty",
        user: "admin",
        details: "Add new faculty: " + parsed.data.name,
      });
      res.status(201).json({ message: "Thêm khoa thành công", faculties: faculties });
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      await addLogEntry({
        message: "Lỗi khi thêm khoa",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi thêm khoa" });
    }
  }

  async updateFaculty(req, res) {
    try {
      const parsed = facultySchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật khoa không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      await Faculty.updateOne({ id: parsed.data.id }, { $set: parsed.data });
      const faculties = await Faculty.find({});
      await addLogEntry({
        message: "Cập nhật khoa thành công",
        level: "info",
        action: "update",
        entity: "faculty",
        user: "admin",
        details: "Update faculty: " + parsed.data.name,
      });
      res.status(200).json({ message: "Cập nhật khoa thành công", faculties: faculties });
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      await addLogEntry({
        message: "Lỗi khi cập nhật khoa",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteFaculty(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID không được để trống" });

      const isUseFaculty = await isUse(id);
      if (isUseFaculty) {
        await addLogEntry({
          message: "Không thể xóa khoa đang được sử dụng",
          level: "warn",
        });
        return res.status(400).json({ error: "Không thể xóa khoa đang được sử dụng" });
      }

      await Faculty.deleteOne({ id });
      const faculties = await Faculty.find({});
      await addLogEntry({
        message: "Xóa khoa thành công",
        level: "info",
        action: "delete",
        entity: "faculty",
        user: "admin",
        details: "Delete faculty: " + id,
      });
      res.status(200).json({ message: "Xóa khoa thành công", faculties: faculties });
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      await addLogEntry({
        message: "Lỗi khi xóa khoa",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi xóa khoa" });
    }
  }
}

module.exports = new FacultyController();