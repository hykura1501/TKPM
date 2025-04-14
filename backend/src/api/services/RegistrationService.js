const RegistrationRepository = require("../repositories/RegistrationRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const { z } = require("zod");
const ClassSectionRepository = require("../repositories/ClassSectionRepository");

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
  async validateRegistration(registration, isUpdate = false) {
    const parsed = registrationSchema.safeParse(registration);
    if (!parsed.success) {
      await addLogEntry({
        message: "Đăng ký học không hợp lệ",
        level: "warn",
      });
      return { success: false, error: parsed.error.errors };
    }

    // Kiểm tra xem sinh viên đã tồn tại hay chưa
    const existingStudent = await StudentRepository.findStudentByMssv(parsed.data.studentId);
    if (!existingStudent) {
      await addLogEntry({
        message: "Sinh viên không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Sinh viên không tồn tại" };
    }

    // Kiểm tra xem lớp học đã tồn tại hay chưa
    const existingClassSection = await ClassSectionRepository.findOneByCondition({
      id: parsed.data.classSectionId,
    });
    if (!existingClassSection) {
      await addLogEntry({
        message: "Lớp học không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Lớp học không tồn tại" };
    }

    // Kiểm tra xem lớp học đã đủ sĩ số chưa
    if (existingClassSection.currentEnrollment >= existingClassSection.maxCapacity) {
      await addLogEntry({
        message: "Lớp học đã đủ sĩ số",
        level: "warn",
      });
      return { success: false, error: "Lớp học đã đủ sĩ số" };
    }

    // Kiểm tra xem sinh viên đã đăng ký lớp học này chưa
    const existingRegistration = await RegistrationRepository.findOneByCondition({
      studentId: parsed.data.studentId,
      classSectionId: parsed.data.classSectionId,
    });
    if (existingRegistration && !isUpdate) {
      await addLogEntry({
        message: "Sinh viên đã đăng ký lớp học này",
        level: "warn",
      });
      return { success: false, error: "Sinh viên đã đăng ký lớp học này" };
    }

    return { success: true, data: parsed.data };
  }

  async getListRegistrations() {
    return await RegistrationRepository.findAll();
  }

  async addRegistration(data) {
    const parsed = await this.validateRegistration(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm đăng ký học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: parsed.error };
    }
    const newId = await RegistrationRepository.getNextId();
    const newRegistration = {
      ...parsed.data,
      id: newId,
    };
    await RegistrationRepository.create(newRegistration);
    //Tăng sĩ số
    const classSection = await ClassSectionRepository.findOneByCondition({
      id: parsed.data.classSectionId,
    });
    if (classSection) {
      classSection.currentEnrollment += 1;
      await ClassSectionRepository.update(classSection.id, classSection);
    } else {
      await addLogEntry({
        message: "Lớp học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Lớp học không tồn tại" };
    }

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
      throw { status: 400, message: parsed.error.errors };
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
      throw { status: 400, message: "ID đăng ký học không được để trống" };
    }

    const student = await StudentRepository.findOneByCondition({
      registration: id,
    });
    if (student) {
      await addLogEntry({
        message: "Không thể xóa đăng ký học đang được sử dụng",
        level: "warn",
      });
      throw { status: 400, message: "Không thể xóa đăng ký học đang được sử dụng" };
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
  async cancelRegistration(id) {
    if (!id) {
      await addLogEntry({
        message: "ID đăng ký học không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID đăng ký học không được để trống" };
    }

    const registration = await RegistrationRepository.findOneByCondition({
      id,
    });
    if (!registration) {
      await addLogEntry({
        message: "Đăng ký học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Đăng ký học không tồn tại" };
    }

    await RegistrationRepository.update(id, { status: "cancelled" });
    //Tăng sĩ số
    const classSection = await ClassSectionRepository.findOneByCondition({
      id: registration.classSectionId,
    });
    if (classSection) {
      classSection.currentEnrollment -= 1;
      await ClassSectionRepository.update(classSection.id, classSection);
    } else {
      await addLogEntry({
        message: "Lớp học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Lớp học không tồn tại" };
    }

    const registrations = await RegistrationRepository.findAll();
    await addLogEntry({
      message: "Hủy đăng ký học thành công",
      level: "info",
      action: "update",
      entity: "registration",
      user: "admin",
      details: `Cancelled registration: ${id}`,
    });
    return { message: "Hủy đăng ký học thành công", registrations };
  }
}

module.exports = new RegistrationService();