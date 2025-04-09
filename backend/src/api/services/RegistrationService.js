const RegistrationRepository = require("../repositories/RegistrationRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const { z } = require("zod");

const registrationSchema = z.object({
  id: z.string().optional(), // ID tự động tạo, không bắt buộc khi thêm mới
  studentId: z.string({ required_error: "Vui lòng chọn sinh viên" }),
  classSectionId: z.string({ required_error: "Vui lòng chọn lớp học" }),
  status: z.enum(["active", "cancelled"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
  grade: z.number().optional(), // Optional grade
});

class RegistrationService {
  async getListRegistrations() {
    return await RegistrationRepository.findAll();
  }

  async addRegistration(data) {
    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm đăng ký học không hợp lệ",
        level: "warn",
      });
      throw { registration: 400, message: parsed.error.errors };
    }

    const newRegistration = {
      ...parsed.data,
      id: `registration-${Date.now()}`,
    };
    await RegistrationRepository.create(newRegistration);
    const registrations = await RegistrationRepository.findAll();
    await addLogEntry({
      message: "Thêm đăng ký học thành công",
      level: "info",
      action: "create",
      entity: "registration",
      user: "admin",
      details: "Add new registration: " + parsed.data.studentId,
    });
    return { message: "Thêm đăng ký học thành công", registrations };
  }

  async updateRegistration(data) {
    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Cập nhật đăng ký học không hợp lệ",
        level: "warn",
      });
      throw { registration: 400, message: parsed.error.errors };
    }

    await RegistrationRepository.update(parsed.data.id, parsed.data);
    const registrations = await RegistrationRepository.findAll();
    await addLogEntry({
      message: "Cập nhật đăng ký học thành công",
      level: "info",
      action: "update",
      entity: "registration",
      user: "admin",
      details: "Updated registration: " + parsed.data.studentId,
    });
    return {
      message: "Cập nhật đăng ký học thành công",
      registrations,
    };
  }

  async deleteRegistration(id) {
    if (!id) {
      await addLogEntry({
        message: "ID đăng ký học không được để trống",
        level: "warn",
      });
      throw { registration: 400, message: "ID đăng ký học không được để trống" };
    }

    const student = await StudentRepository.findOneByCondition({
      registration: id,
    });
    if (student) {
      await addLogEntry({
        message: "Không thể xóa đăng ký học đang được sử dụng",
        level: "warn",
      });
      throw {
        registration: 400,
        message: "Không thể xóa đăng ký học đang được sử dụng",
      };
    }

    await RegistrationRepository.delete(id);
    const registrations = await RegistrationRepository.findAll();
    await addLogEntry({
      message: "Xóa đăng ký học thành công",
      level: "info",
      action: "delete",
      entity: "registration",
      user: "admin",
      details: `Deleted registration: ${id}`,
    });
    return { message: "Xóa đăng ký học thành công", registrations };
  }

  async registrationExists(id) {
    const registration = await RegistrationRepository.findOneByCondition({
      id,
    });
    return !!registration;
  }
}

module.exports = new RegistrationService();