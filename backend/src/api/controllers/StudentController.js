const { addLogEntry } = require('../helpers/logging');
const Student = require('../models/Student');
const { z } = require('zod');

// Define the schema for input validation
const studentSchema = z.object({
  mssv: z.string().optional(),
  fullName: z.string().min(3, "Họ tên không hợp lệ"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
  gender: z.enum(["male", "female", "other"]),
  faculty: z.string(),
  course: z.string(),
  program: z.string(),
  permanentAddress: z.object({
    streetAddress: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string(),
    country: z.string(),
  }).optional(),
  temporaryAddress: z.object({
    streetAddress: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string(),
    country: z.string(),
  }).optional(),
  mailingAddress: z.object({
    streetAddress: z.string(),
    ward: z.string(),
    district: z.string(),
    province: z.string(),
    country: z.string(),
  }).optional(),
  identityDocument: z.union([
    z.object({
      type: z.literal("CMND"),
      number: z.string(),
      issueDate: z.string(),
      issuePlace: z.string(),
      expiryDate: z.string(),
    }),
    z.object({
      type: z.literal("CCCD"),
      number: z.string(),
      issueDate: z.string(),
      issuePlace: z.string(),
      expiryDate: z.string(),
      hasChip: z.boolean(),
    }),
    z.object({
      type: z.literal("Passport"),
      number: z.string(),
      issueDate: z.string(),
      issuePlace: z.string(),
      expiryDate: z.string(),
      issuingCountry: z.string(),
      notes: z.string().optional(),
    }),
  ]).optional(),
  nationality: z.string(),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(0[0-9]{9})$/, "Số điện thoại không hợp lệ"),
  status: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

class StudentController {
  async getListStudents(req, res) {
    try {
      const students = await Student.find({}, { _id: 0 });
      await addLogEntry({
        message: "Lấy danh sách sinh viên",
        level: "info",
        action: "login",
        entity: "system",
        user: "system",
        details: "System initialized",
      });
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách sinh viên" });
    }
  }

  async addStudent(req, res) {
    try {
      const parsed = studentSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      // Get all MSSV from the database and find the highest value
      const students = await Student.find({}, { mssv: 1 });
      const maxMssv = students.reduce((max, student) => {
        const numberPart = parseInt(student.mssv.replace("SV", ""), 10);
        return isNaN(numberPart) ? max : Math.max(max, numberPart);
      }, 0);

      // Create a new MSSV with the format "SVxxx"
      const newMssv = `SV${String(maxMssv + 1).padStart(3, "0")}`;

      // Add MSSV to the student data
      const newStudent = { ...parsed.data, mssv: newMssv };

      await Student.create(newStudent);
      await addLogEntry({
        message: "Thêm sinh viên mới",
        level: "info",
        action: "create",
        entity: "student",
        entityId: newStudent.mssv,
        user: "admin",
        details: `Created student: ${newStudent.fullName}`,
      });
      res.status(201).json({ message: "Thêm sinh viên thành công", student: newStudent });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi thêm sinh viên" });
    }
  }

  async updateStudent(req, res) {
    try {
      const parsed = studentSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      await Student.updateOne({ mssv: parsed.data.mssv }, { $set: parsed.data });
      await addLogEntry({
        message: "Cập nhật sinh viên",
        level: "info",
        action: "update",
        entity: "student",
        entityId: parsed.data.mssv,
        user: "admin",
        details: `Updated student: ${parsed.data.fullName}`,
      });

      res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật" });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { mssv } = req.params;

      if (!mssv) {
        await addLogEntry({
          message: "MSSV không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "MSSV không được để trống" });
      }

      await Student.deleteOne({ mssv });
      await addLogEntry({
        message: "Xóa sinh viên",
        level: "info",
        action: "delete",
        entity: "student",
        entityId: mssv,
        user: "admin",
        details: `Deleted student: ${mssv}`,
      });

      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi xóa" });
    }
  }
}

module.exports = new StudentController();