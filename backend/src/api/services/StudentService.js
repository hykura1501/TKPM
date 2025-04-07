const z = require("zod");
const StudentRepository = require("../repositories/StudentRepository");
const SettingService = require("..//services/SettingService");
const { addLogEntry } = require("../helpers/logging");
const generateStatusTransitionRules = require("../helpers/statusRule");
const FacultyService = require("../services/FacultyService");
const ProgramService = require("../services/ProgramService");
const StatusService = require("../services/StatusService");


class StudentService {
  constructor() {
    this.studentSchema = z.object({
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
      email: z.string().email({ message: "Email không hợp lệ" }),
      phone: z.string(),
      status: z.string(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    });
  }

  async getListStudents() {
    try {
      const students = await StudentRepository.getAllStudents();
      await addLogEntry({
        message: "Lấy danh sách sinh viên",
        level: "info",
        action: "login",
        entity: "system",
        user: "system",
        details: "System initialized",
      });
      return students;
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách sinh viên: " + error.message);
    }
  }

  async addStudent(studentData) {
    try {
      const setting = await SettingService.getAllSettings();
      const allowedDomains = setting?.allowedEmailDomains || [];
      const phoneFormats = setting?.phoneFormats || [];

      const dynamicSchema = this.studentSchema.extend({
        email: this.studentSchema.shape.email.refine(
          (email) => allowedDomains.includes(email.split("@")[1]),
          {
            message:
              "Email phải thuộc một trong các tên miền: " +
              allowedDomains.join(", "),
          }
        ),
        phone: this.studentSchema.shape.phone.refine(
          (phone) =>
            phoneFormats.some((format) => new RegExp(format.pattern).test(phone)),
          { message: "Số điện thoại không hợp lệ" }
        ),
      });

      const parsed = dynamicSchema.safeParse(studentData);
      if (!parsed.success) {
        await addLogEntry({
          message: "Thêm sinh viên không hợp lệ",
          level: "warn",
        });
        throw new Error(JSON.stringify(parsed.error.errors));
      }

      if (!(await FacultyService.facultyExists(parsed.data.faculty))) {
        throw new Error("Khoa không tồn tại");
      }
      if (!(await ProgramService.programExists(parsed.data.program))) {
        throw new Error("Chương trình không tồn tại");
      }
      if (!(await StatusService.statusExists(parsed.data.status))) {
        throw new Error("Trạng thái sinh viên không tồn tại");
      }

      const newMssv = await StudentRepository.getNextMssv();
      const newStudent = { ...parsed.data, mssv: newMssv };

      await StudentRepository.createStudent(newStudent);
      await addLogEntry({
        message: "Thêm sinh viên mới",
        level: "info",
        action: "create",
        entity: "student",
        entityId: newStudent.mssv,
        user: "admin",
        details: `Created student: ${newStudent.fullName}`,
      });

      return newStudent;
    } catch (error) {
      throw new Error("Lỗi khi thêm sinh viên: " + error.message);
    }
  }

  async updateStudent(studentData) {
    try {
      const setting = await SettingService.getAllSettings();
      const allowedDomains = setting?.allowedEmailDomains || [];
      const phoneFormats = setting?.phoneFormats || [];

      const dynamicSchema = this.studentSchema.extend({
        email: this.studentSchema.shape.email.refine(
          (email) => allowedDomains.includes(email.split("@")[1]),
          {
            message:
              "Email phải thuộc một trong các tên miền: " +
              allowedDomains.join(", "),
          }
        ),
        phone: this.studentSchema.shape.phone.refine(
          (phone) =>
            phoneFormats.some((format) => new RegExp(format.pattern).test(phone)),
          { message: "Số điện thoại không hợp lệ" }
        ),
      });

      const parsed = dynamicSchema.safeParse(studentData);
      if (!parsed.success) {
        await addLogEntry({
          message: "Cập nhật sinh viên không hợp lệ",
          level: "warn",
        });
        throw new Error(JSON.stringify(parsed.error.errors));
      }

      const currentStudent = await StudentRepository.findStudentByMssv(parsed.data.mssv);
      if (!currentStudent) {
        throw new Error("Sinh viên không tồn tại");
      }

      const currentStatus = await StatusService.findStatusById(currentStudent.status);
      const newStatus = await StatusService.findStatusById(parsed.data.status);
      if (!currentStatus || !newStatus) {
        throw new Error("Trạng thái không tồn tại");
      }

      const statusTransitionRules = generateStatusTransitionRules(await StatusService.getAllStatuses());
      const allowedStatus = statusTransitionRules[currentStatus.name];
      if (!allowedStatus.includes(newStatus.name) && newStatus.name !== currentStatus.name) {
        throw new Error("Không thể chuyển trạng thái");
      }

      await StudentRepository.updateStudent(parsed.data.mssv, parsed.data);
      await addLogEntry({
        message: "Cập nhật sinh viên",
        level: "info",
        action: "update",
        entity: "student",
        entityId: parsed.data.mssv,
        user: "admin",
        details: `Updated student: ${parsed.data.fullName}`,
      });
    } catch (error) {
      throw new Error("Lỗi khi cập nhật sinh viên: " + error.message);
    }
  }

  async deleteStudent(mssv) {
    try {
      if (!mssv) {
        await addLogEntry({
          message: "MSSV không được để trống",
          level: "warn",
        });
        throw new Error("MSSV không được để trống");
      }

      await StudentRepository.deleteStudent(mssv);
      await addLogEntry({
        message: "Xóa sinh viên",
        level: "info",
        action: "delete",
        entity: "student",
        entityId: mssv,
        user: "admin",
        details: `Deleted student: ${mssv}`,
      });
    } catch (error) {
      throw new Error("Lỗi khi xóa sinh viên: " + error.message);
    }
  }

  async addStudentsFromFile(studentsData) {
    try {
      const setting = await SettingService.getAllSettings();
      const allowedDomains = setting?.allowedEmailDomains || [];
      const phoneFormats = setting?.phoneFormats || [];
      const dynamicSchema = this.studentSchema.extend({
        email: this.studentSchema.shape.email.refine(
          (email) => allowedDomains.includes(email.split("@")[1]),
          {
            message:
              "Email phải thuộc một trong các tên miền: " +
              allowedDomains.join(", "),
          }
        ),
        phone: this.studentSchema.shape.phone.refine(
          (phone) =>
            phoneFormats.some((format) => new RegExp(format.pattern).test(phone)),
          { message: "Số điện thoại không hợp lệ" }
        ),
      });

      const newStudents = [];
      for (const student of studentsData) {
        const status = await StatusService.findStatusByName(student.status);
        const faculty = await FacultyService.findFacultyByName(student.faculty);
        const program = await ProgramService.findProgramByName(student.program);

        if (!status || !faculty || !program) {
          throw new Error("Dữ liệu không hợp lệ");
        }

        student.status = status.id;
        student.faculty = faculty.id;
        student.program = program.id;

        const parsed = dynamicSchema.safeParse(student);
        if (!parsed.success) {
          throw new Error(JSON.stringify(parsed.error.errors));
        }

        newStudents.push(parsed.data);
      }

      await StudentRepository.createManyStudents(newStudents);
      return newStudents;
    } catch (error) {
      throw new Error("Lỗi khi thêm nhiều sinh viên từ file: " + error.message);
    }
  }

  async addStudentFromFile(studentData) {
    try {
      const setting = await SettingService.getAllSettings();
      const allowedDomains = setting?.allowedEmailDomains || [];
      const phoneFormats = setting?.phoneFormats || [];

      const status = await StatusService.findStatusByName(studentData.status);
      const faculty = await FacultyService.findFacultyByName(studentData.faculty);
      const program = await ProgramService.findProgramByName(studentData.program);

      if (!status || !faculty || !program) {
        throw new Error("Dữ liệu không hợp lệ");
      }

      studentData.status = status.id;
      studentData.faculty = faculty.id;
      studentData.program = program.id;

      const dynamicSchema = this.studentSchema.extend({
        email: this.studentSchema.shape.email.refine(
          (email) => allowedDomains.includes(email.split("@")[1]),
          {
            message:
              "Email phải thuộc một trong các tên miền: " +
              allowedDomains.join(", "),
          }
        ),
        phone: this.studentSchema.shape.phone.refine(
          (phone) =>
            phoneFormats.some((format) => new RegExp(format.pattern).test(phone)),
          { message: "Số điện thoại không hợp lệ" }
        ),
      });

      const parsed = dynamicSchema.safeParse(studentData);
      if (!parsed.success) {
        throw new Error(JSON.stringify(parsed.error.errors));
      }

      const newMssv = await StudentRepository.getNextMssv();
      const newStudent = { ...parsed.data, mssv: newMssv };

      await StudentRepository.createStudent(newStudent);
      return newStudent;
    } catch (error) {
      throw new Error("Lỗi khi thêm sinh viên từ file: " + error.message);
    }
  }
}

module.exports = new StudentService();