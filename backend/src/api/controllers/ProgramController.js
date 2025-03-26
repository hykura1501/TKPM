const Program = require('../models/Program');
const Student = require('../models/Student');
const { z } = require('zod');
const { addLogEntry } = require('../helpers/logging');

// Define the schema for input validation
const programSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  faculty: z.string(),
});

class ProgramController {
  async getListPrograms(req, res) {
    try {
      const programs = await Program.find({});
      res.status(200).json(programs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chương trình học:", error);
      await addLogEntry({
        message: "Lỗi khi lấy danh sách chương trình học",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi lấy danh sách chương trình học" });
    }
  }

  async addProgram(req, res) {
    try {
      const parsed = programSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm chương trình học không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      const newProgram = new Program(parsed.data);
      //Tạo id tự động
      newProgram.id = `program-${Date.now()}`;
      await newProgram.save();
      const programs = await Program.find({});
      await addLogEntry({
        message: "Thêm chương trình học thành công",
        level: "info",
        action: "create",
        entity: "program",
        user: "admin",
        details: "Add new program: " + parsed.data.name,
      });
      res.status(201).json({ message: "Thêm chương trình học thành công", programs: programs });
    } catch (error) {
      console.error("Lỗi khi thêm chương trình học:", error);
      await addLogEntry({
        message: "Lỗi khi thêm chương trình học",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi thêm chương trình học" });
    }
  }

  async updateProgram(req, res) {
    try {
      const parsed = programSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật chương trình học không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      await Program.updateOne({ id: parsed.data.id }, { $set: parsed.data });
      const programs = await Program.find({});
      await addLogEntry({
        message: "Cập nhật chương trình học thành công",
        level: "info",
        action: "update",
        entity: "program",
        user: "admin",
        details: "Updated program: " + parsed.data.name,
      });
      res.status(200).json({ message: "Cập nhật chương trình học thành công", programs: programs });
    } catch (error) {
      console.error("Lỗi khi cập nhật chương trình học:", error);
      await addLogEntry({
        message: "Lỗi khi cập nhật chương trình học",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi cập nhật chương trình học" });
    }
  }

  async deleteProgram(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        await addLogEntry({
          message: "ID không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "ID không được để trống" });
      }
      //Kiểm tra có ai đang học chương trình này không
      const students = await Student.find({ program: id });
      if (students.length > 0) {
        await addLogEntry({
          message: "Không thể xóa chương trình học",
          level: "warn",
        });
        return res.status(400).json({ error: "Không thể xóa chương trình học" });
      }

      await Program.deleteOne({ id });
      const programs = await Program.find({});
      await addLogEntry({
        message: "Xóa chương trình học thành công",
        level: "info",
        action: "delete",
        entity: "program",
        user: "admin",
        details: "Deleted program: " + id,
      });
      res.status(200).json({ message: "Xóa chương trình học thành công", programs: programs });
    } catch (error) {
      console.error("Lỗi khi xóa chương trình học:", error);
      await addLogEntry({
        message: "Lỗi khi xóa chương trình học",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi xóa chương trình học" });
    }
  }
}

module.exports = new ProgramController();