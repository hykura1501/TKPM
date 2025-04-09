const CourseRepository = require("../repositories/CourseRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const { z } = require("zod");
const FacultyRepository = require("../repositories/FacultyRepository");

const courseSchema = z.object({
  id: z.string().optional(), // ID tự động tạo, không bắt buộc khi thêm mới
  code: z.string().min(3, { message: "Mã khóa học phải có ít nhất 3 ký tự" }),
  name: z.string().min(3, { message: "Tên khóa học phải có ít nhất 3 ký tự" }),
  credits: z
    .number()
    .min(2, { message: "Số tín chỉ phải lớn hơn hoặc bằng 2" })
    .max(10, { message: "Số tín chỉ không được vượt quá 10" }),
  faculty: z.string({ required_error: "Vui lòng chọn khoa phụ trách" }),
  description: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
  prerequisites: z.array(z.string()).default([]),
});

class CourseService {
  async validateCourse(course) {
    const parsed = courseSchema.safeParse(course);
    if (!parsed.success) {
      await addLogEntry({ message: "Mã khóa học không hợp lệ", level: "warn" });
      return { success: false, error: parsed.error.errors };
    }
  
    const existingCourse = await CourseRepository.findOneByCondition({
      code: parsed.data.code,
    });
    if (existingCourse) {
      await addLogEntry({ message: "Mã khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Mã khóa học đã tồn tại" };
    }
  
    const existingCourseName = await CourseRepository.findOneByCondition({
      name: parsed.data.name,
    });
    if (existingCourseName) {
      await addLogEntry({ message: "Tên khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Tên khóa học đã tồn tại" };
    }
  
    const existingFaculty = await FacultyRepository.findOneByCondition({
      faculty: parsed.data.faculty,
    });
    if (!existingFaculty) {
      await addLogEntry({
        message: "Khoa phụ trách không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Khoa phụ trách không tồn tại" };
    }
  
    return { success: true, data: parsed.data };
  }
  async getListCoursees() {
    return await CourseRepository.findAll();
  }

  async addCourse(data) {
    const validationResult = await this.validateCourse(data);
  
    if (!validationResult.success) {
      await addLogEntry({
        message: "Thêm tình trạng sinh viên không hợp lệ",
        level: "warn",
      });
      return { success: false, error: validationResult.error };
    }
  
    const course = validationResult.data;
  
    const newId = await CourseRepository.getNextId();
    const newCourse = { ...course, id: newId };
    await CourseRepository.create(newCourse);
  
    const coursees = await CourseRepository.findAll();
    await addLogEntry({
      message: "Thêm tình trạng sinh viên thành công",
      level: "info",
      action: "create",
      entity: "course",
      user: "admin",
      details: "Add new course: " + course.name,
    });
  
    return { success: true, message: "Thêm tình trạng sinh viên thành công", coursees };
  }

  async updateCourse(data) {
    // Sử dụng hàm validateCourse để kiểm tra dữ liệu
    const validationResult = await this.validateCourse(data);
    if (!validationResult.success) {
      await addLogEntry({
        message: "Cập nhật khóa học không hợp lệ",
        level: "warn",
      });
      return { success: false, error: validationResult.error };
    }
  
    // Kiểm tra xem khóa học có tồn tại hay không
    const existingCourse = await CourseRepository.findOneByCondition({
      id: validationResult.data.id,
    });
    if (!existingCourse) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Khóa học không tồn tại" };
    }
  
    // Cập nhật khóa học
    await CourseRepository.update(validationResult.data.id, validationResult.data);
    const courses = await CourseRepository.findAll();
  
    // Ghi log thành công
    await addLogEntry({
      message: "Cập nhật khóa học thành công",
      level: "info",
      action: "update",
      entity: "course",
      user: "admin",
      details: "Updated course: " + validationResult.data.name,
    });
  
    return { success: true, message: "Cập nhật khóa học thành công", courses };
  }
  async deleteCourse(id) {
    if (!id) {
      await addLogEntry({
        message: "ID khóa học không được để trống",
        level: "warn",
      });
      return { success: false, error: "ID khóa học không được để trống" };
    }
  
    // Kiểm tra xem khóa học có tồn tại hay không
    const existingCourse = await CourseRepository.findOneByCondition({ id });
    if (!existingCourse) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      return { success: false, error: "Khóa học không tồn tại" };
    }
  
    // Kiểm tra xem khóa học có đang được sử dụng bởi sinh viên hay không
    const student = await StudentRepository.findOneByCondition({ course: id });
    if (student) {
      await addLogEntry({
        message: "Không thể xóa khóa học đang được sử dụng",
        level: "warn",
      });
      return {
        success: false,
        error: "Không thể xóa khóa học đang được sử dụng",
      };
    }
  
    // Xóa khóa học
    await CourseRepository.delete(id);
    const courses = await CourseRepository.findAll();
  
    // Ghi log thành công
    await addLogEntry({
      message: "Xóa khóa học thành công",
      level: "info",
      action: "delete",
      entity: "course",
      user: "admin",
      details: `Deleted course: ${id}`,
    });
  
    return { success: true, message: "Xóa khóa học thành công", courses };
  }

  async courseExists(id) {
    const course = await CourseRepository.findOneByCondition({ id });
    return !!course;
  }
}

module.exports = new CourseService();
