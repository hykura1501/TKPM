const { addLogEntry } = require("../helpers/logging");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Status = require("../models/Status");
const Program = require("../models/Program");
const Counter = require("../models/Counter");
const Setting = require("../models/Setting");
const { z } = require("zod");
const generateStatusTransitionRules = require("../helpers/statusRule");

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
      const setting = await Setting.findOne();
      const allowedDomains = setting?.allowDomains || []; // Define the schema for input validation
      const studentSchema = z.object({
        mssv: z.string().optional(),
        fullName: z.string().min(3, "Họ tên không hợp lệ"),
        dateOfBirth: z
          .string()
          .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
        gender: z.enum(["male", "female", "other"]),
        faculty: z.string(),
        course: z.string(),
        program: z.string(),
        permanentAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        temporaryAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        mailingAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        identityDocument: z
          .union([
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
          ])
          .optional(),
        nationality: z.string(),
        email: z
          .string()
          .email({ message: "Email không hợp lệ" })
          .refine(
            (email) => {
              const domain = email.split("@")[1];
              return allowedDomains.includes(domain);
            },
            {
              message:
                "Email phải thuộc một trong các tên miền: " +
                allowedDomains.join(", "),
            }
          ),
        phone: z.string().refine((phone) => {
          // Kiểm tra số điện thoại dựa trên pattern từ phoneFormats
          return setting.allowPhones.some((format) => {
            const regex = new RegExp(format.pattern); // Sử dụng pattern từ phoneFormats
            return regex.test(phone);
          });
        }),
        status: z.string(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      });
      const parsed = studentSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }

      // **Tạo MSSV đảm bảo không trùng**
      const counter = await Counter.findOneAndUpdate(
        { name: "student_mssv" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      const newMssv = `SV${String(counter.value).padStart(3, "0")}`;

      // Add MSSV to the student data
      const newStudent = { ...parsed.data, mssv: newMssv };
      //Kiểm tra các thành phần hợp lệ
      //Khoa, chương trình , trạng thái sinh viên
      if (!(await Faculty.exists({ id: newStudent.faculty }))) {
        return res.status(400).json({ error: "Khoa không tồn tại" });
      }
      if (!(await Program.exists({ id: newStudent.program }))) {
        return res.status(400).json({ error: "Chương trình không tồn tại" });
      }
      if (!(await Status.exists({ id: newStudent.status }))) {
        return res
          .status(400)
          .json({ error: "Trạng thái sinh viên không tồn tại" });
      }

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
      res
        .status(201)
        .json({ message: "Thêm sinh viên thành công", student: newStudent });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi thêm sinh viên" });
    }
  }

  async updateStudent(req, res) {
    try {
      const setting = await Setting.findOne();
      const allowedDomains = setting?.allowDomains || []; // Define the schema for input validation
      const studentSchema = z.object({
        mssv: z.string().optional(),
        fullName: z.string().min(3, "Họ tên không hợp lệ"),
        dateOfBirth: z
          .string()
          .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
        gender: z.enum(["male", "female", "other"]),
        faculty: z.string(),
        course: z.string(),
        program: z.string(),
        permanentAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        temporaryAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        mailingAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        identityDocument: z
          .union([
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
          ])
          .optional(),
        nationality: z.string(),
        email: z
          .string()
          .email({ message: "Email không hợp lệ" })
          .refine(
            (email) => {
              const domain = email.split("@")[1];
              return allowedDomains.includes(domain);
            },
            {
              message:
                "Email phải thuộc một trong các tên miền: " +
                allowedDomains.join(", "),
            }
          ),
        phone: z.string().refine((phone) => {
          // Kiểm tra số điện thoại dựa trên pattern từ phoneFormats
          return setting.allowPhones.some((format) => {
            const regex = new RegExp(format.pattern); // Sử dụng pattern từ phoneFormats
            return regex.test(phone);
          });
        }),
        status: z.string(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      });
      const parsed = studentSchema.safeParse(req.body);

      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật sinh viên không hợp lệ",
          level: "warn",
        });
        return res.status(400).json({ error: parsed.error.errors });
      }
      //Kiểm tra trạng thái hợp lệ
      const currentStudent = await Student.findOne({ mssv: parsed.data.mssv });
      if (!currentStudent) {
        return res.status(404).json({ error: "Sinh viên không tồn tại" });
      }
      const currentStatus = await Status.findOne({ id: currentStudent.status });
      if (!currentStatus) {
        return res.status(400).json({ error: "Trạng thái không tồn tại" });
      }
      const statusTransitionRules = generateStatusTransitionRules(
        await Status.find({})
      );

      const allowedStatus = statusTransitionRules[currentStatus.name];
      const newStatus = await Status.findOne({ id: parsed.data.status });
      if (!newStatus) {
        return res.status(400).json({ error: "Trạng thái không tồn tại" });
      }
      if (
        !allowedStatus.includes(newStatus.name) &&
        newStatus.name !== currentStatus.name
      ) {
        return res.status(400).json({ error: "Không thể chuyển trạng thái" });
      }
      await Student.updateOne(
        { mssv: parsed.data.mssv },
        { $set: parsed.data }
      );
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
  async addStudentsFromFile(req, res) {
    try {
      // Lúc này ta nhận được trong body một mảng sinh viên
      const students = req.body;

      // Mảng lưu danh sách sinh viên chuẩn hóa
      const newStudents = [];

      for (const student of students) {
        // Chuyển đổi trạng thái, khoa và chương trình
        const status = await Status.findOne({ name: student.status });
        const faculty = await Faculty.findOne({ name: student.faculty });
        const program = await Program.findOne({ name: student.program });

        if (!status || !faculty || !program) {
          return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
        }

        // Sửa lại dữ liệu sinh viên
        student.status = status.id;
        student.faculty = faculty.id;
        student.program = program.id;
        const setting = await Setting.findOne();
        const allowedDomains = setting?.allowDomains || []; // Define the schema for input validation
        const studentSchema = z.object({
          mssv: z.string().optional(),
          fullName: z.string().min(3, "Họ tên không hợp lệ"),
          dateOfBirth: z
            .string()
            .refine(
              (date) => !isNaN(Date.parse(date)),
              "Ngày sinh không hợp lệ"
            ),
          gender: z.enum(["male", "female", "other"]),
          faculty: z.string(),
          course: z.string(),
          program: z.string(),
          permanentAddress: z
            .object({
              streetAddress: z.string(),
              ward: z.string(),
              district: z.string(),
              province: z.string(),
              country: z.string(),
            })
            .optional(),
          temporaryAddress: z
            .object({
              streetAddress: z.string(),
              ward: z.string(),
              district: z.string(),
              province: z.string(),
              country: z.string(),
            })
            .optional(),
          mailingAddress: z
            .object({
              streetAddress: z.string(),
              ward: z.string(),
              district: z.string(),
              province: z.string(),
              country: z.string(),
            })
            .optional(),
          identityDocument: z
            .union([
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
            ])
            .optional(),
          nationality: z.string(),
          email: z
            .string()
            .email({ message: "Email không hợp lệ" })
            .refine(
              (email) => {
                const domain = email.split("@")[1];
                return allowedDomains.includes(domain);
              },
              {
                message:
                  "Email phải thuộc một trong các tên miền: " +
                  allowedDomains.join(", "),
              }
            ),
          phone: z.string().refine((phone) => {
            // Kiểm tra số điện thoại dựa trên pattern từ phoneFormats
            return setting.allowPhones.some((format) => {
              const regex = new RegExp(format.pattern); // Sử dụng pattern từ phoneFormats
              return regex.test(phone);
            });
          }),
          status: z.string(),
          createdAt: z.string().optional(),
          updatedAt: z.string().optional(),
        });

        // Kiểm tra dữ liệu sinh viên
        const parsed = studentSchema.safeParse(student);
        if (!parsed.success) {
          return res.status(400).json({ error: parsed.error.errors });
        }

        // Thêm sinh viên vào mảng
        newStudents.push(parsed.data);
      }

      // Thêm sinh viên vào cơ sở dữ liệu
      await Student.insertMany(newStudents);

      res
        .status(201)
        .json({ message: "Thêm sinh viên thành công", students: newStudents });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      res.status(500).json({ error: "Lỗi khi thêm sinh viên từ file" });
    }
  }
  async addStudentFromFile(req, res) {
    try {
      const student = req.body;

      // Tìm status, faculty, program theo name
      const status = await Status.findOne({ name: student.status });
      const faculty = await Faculty.findOne({ name: student.faculty });
      const program = await Program.findOne({ name: student.program });

      if (!status || !faculty || !program) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
      }

      student.status = status.id;
      student.faculty = faculty.id;
      student.program = program.id;
      const setting = await Setting.findOne();
      const allowedDomains = setting?.allowDomains || []; // Define the schema for input validation
      const studentSchema = z.object({
        mssv: z.string().optional(),
        fullName: z.string().min(3, "Họ tên không hợp lệ"),
        dateOfBirth: z
          .string()
          .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
        gender: z.enum(["male", "female", "other"]),
        faculty: z.string(),
        course: z.string(),
        program: z.string(),
        permanentAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        temporaryAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        mailingAddress: z
          .object({
            streetAddress: z.string(),
            ward: z.string(),
            district: z.string(),
            province: z.string(),
            country: z.string(),
          })
          .optional(),
        identityDocument: z
          .union([
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
          ])
          .optional(),
        nationality: z.string(),
        email: z
          .string()
          .email({ message: "Email không hợp lệ" })
          .refine(
            (email) => {
              const domain = email.split("@")[1];
              return allowedDomains.includes(domain);
            },
            {
              message:
                "Email phải thuộc một trong các tên miền: " +
                allowedDomains.join(", "),
            }
          ),
        phone: z.string().refine((phone) => {
          // Kiểm tra số điện thoại dựa trên pattern từ phoneFormats
          return setting.allowPhones.some((format) => {
            const regex = new RegExp(format.pattern); // Sử dụng pattern từ phoneFormats
            return regex.test(phone);
          });
        }),
        status: z.string(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      });
      const parsed = studentSchema.safeParse(student);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }

      // **Tạo MSSV đảm bảo không trùng**
      const counter = await Counter.findOneAndUpdate(
        { name: "student_mssv" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      student.mssv = `SV${String(counter.value).padStart(3, "0")}`;

      // Tạo sinh viên mới
      await Student.create(student);
      res.status(201).json({ message: "Thêm sinh viên thành công", student });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      res.status(500).json({ error: "Lỗi khi thêm sinh viên từ file" });
    }
  }
}

module.exports = new StudentController();
