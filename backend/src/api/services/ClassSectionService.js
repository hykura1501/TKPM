const ClassSectionRepository = require("../repositories/ClassSectionRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const CourseRepository = require("../repositories/CourseRepository");
const { z } = require("zod");

const classSectionSchema = z.object({
  id: z.string().optional(), // ID tự động tạo, không bắt buộc khi thêm mới
  code: z.string().min(1, "Mã lớp không được để trống"), // Mã lớp học
  courseId: z.string({ required_error: "Vui lòng chọn khóa học" }),
  academicYear: z.string().min(4, { message: "Vui lòng nhập năm học" }),
  semester: z.string({ required_error: "Vui lòng chọn học kỳ" }),
  currentEnrollment: z.number().optional(), // Sĩ số hiện tại, có thể không có khi thêm mới
  instructor: z
    .string()
    .min(3, { message: "Tên giảng viên phải có ít nhất 3 ký tự" }),
  maxCapacity: z
    .number()
    .min(1, { message: "Sĩ số tối đa phải lớn hơn 0" })
    .max(100, { message: "Sĩ số tối đa không được vượt quá 100" }),
  schedule: z.string().min(3, { message: "Vui lòng nhập lịch học" }),
  classroom: z.string().min(1, { message: "Vui lòng nhập phòng học" }),
});

class ClassSectionService {
  async validateClassSection(classSection, isUpdate = false) {
    const parsed = classSectionSchema.safeParse(classSection);
    if (!parsed.success) {
      await addLogEntry({
        message: "Mã lớp học không hợp lệ",
        level: "warn",
      });
      return { success: false, error: parsed.error.errors };
    }

    // Kiểm tra xem mã lớp học đã tồn tại hay chưa
    const existingClassSection = await ClassSectionRepository.findOneByCondition({
      code: parsed.data.code,
    });
    if ( !isUpdate && existingClassSection) {
      await addLogEntry({
        message: "Mã lớp học đã tồn tại",
        level: "warn",
      });
      return { success: false, error: "Mã lớp học đã tồn tại" };
    }
    
    // Kiểm tra xem khóa học đã tồn tại hay chưa
    const existingCourse = await CourseRepository.findOneByCondition({
      id: parsed.data.courseId,
    });
    if (!existingCourse) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Khóa học không tồn tại" };
    }

    return { success: true, data: parsed.data };
  }

  async getListClassSections() {
    return await ClassSectionRepository.findAll();
  }

  async addClassSection(data) {
    const validationResult = await this.validateClassSection(data);
    if (!validationResult.success) {
      await addLogEntry({
        message: "Thêm lớp học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: validationResult.error };
    }

    const newId = await ClassSectionRepository.getNextId();
    const newClassSection = {
      ...validationResult.data,
      id: newId,
    };
    await ClassSectionRepository.create(newClassSection);
    const classSections = await ClassSectionRepository.findAll();
    await addLogEntry({
      message: "Thêm lớp học thành công",
      level: "info",
      action: "create",
      entity: "classSection",
      user: "admin",
      details: "Add new classSection: " + validationResult.data.code,
    });
    return { message: "Thêm lớp học thành công", classSections };
  }

  async updateClassSection(data) {
    // Sử dụng hàm validateClassSection để kiểm tra dữ liệu
    const validationResult = await this.validateClassSection(data, true);
    if (!validationResult.success) {
      await addLogEntry({
        message: "Cập nhật lớp học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: validationResult.error };
    }
  
    // Kiểm tra xem lớp học có tồn tại hay không
    const existingClassSection = await ClassSectionRepository.findOneByCondition({
      id: validationResult.data.id,
    });
    if (!existingClassSection) {
      await addLogEntry({
        message: "Lớp học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Lớp học không tồn tại" };
    }
  
    // Cập nhật lớp học
    await ClassSectionRepository.update(validationResult.data.id, validationResult.data);
    const classSections = await ClassSectionRepository.findAll();
  
    // Ghi log thành công
    await addLogEntry({
      message: "Cập nhật lớp học thành công",
      level: "info",
      action: "update",
      entity: "classSection",
      user: "admin",
      details: "Updated classSection: " + validationResult.data.code,
    });
  
    return { success: true, message: "Cập nhật lớp học thành công", classSections };
  }

  async deleteClassSection(id) {
    if (!id) {
      await addLogEntry({
        message: "ID lớp học không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID lớp học không được để trống" };
    }
  
    // Kiểm tra xem lớp học có tồn tại hay không
    const existingClassSection = await ClassSectionRepository.findOneByCondition({
      id,
    });
    if (!existingClassSection) {
      await addLogEntry({
        message: "Lớp học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Lớp học không tồn tại" };
    }
  
    // Kiểm tra xem lớp học có đang được sử dụng bởi sinh viên hay không
    if (existingClassSection.currentEnrollment > 0) {
      await addLogEntry({
        message: "Không thể xóa lớp học đang được sử dụng",
        level: "warn",
      });
      throw { status: 400, message: "Không thể xóa lớp học đang được sử dụng" };
    }
  
    // Xóa lớp học
    await ClassSectionRepository.delete(id);
    const classSections = await ClassSectionRepository.findAll();
  
    // Ghi log thành công
    await addLogEntry({
      message: "Xóa lớp học thành công",
      level: "info",
      action: "delete",
      entity: "classSection",
      user: "admin",
      details: `Deleted classSection: ${id}`,
    });
  
    return { success: true, message: "Xóa lớp học thành công", classSections };
  }

  async classSectionExists(id) {
    const classSection = await ClassSectionRepository.findOneByCondition({
      id,
    });
    return !!classSection;
  }
}

module.exports = new ClassSectionService();
