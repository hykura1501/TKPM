const CourseRepository = require("../repositories/CourseRepository");
const ClassSectionRepository = require("../repositories/ClassSectionRepository");
const { addLogEntry } = require("../helpers/logging");
const { z } = require("zod");
const FacultyRepository = require("../repositories/FacultyRepository");
const Mapper = require("../helpers/Mapper");
const { SUPPORTED_LOCALES } = require("../../configs/locales");

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
  async validateCourse(course, isUpdate = false) {
    const parsed = courseSchema.safeParse(course);
    if (!parsed.success) {
      await addLogEntry({ message: "Khóa học không hợp lệ", level: "warn" });
      return { success: false, error: parsed.error.errors.message };
    }

    const existingCourse = await CourseRepository.findOneByCondition({
      code: parsed.data.code,
    });
    if (!isUpdate && existingCourse) {
      await addLogEntry({ message: "Mã khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Mã khóa học đã tồn tại" };
    }

    let existingCourseName = null;
    for (const locale of SUPPORTED_LOCALES) {
      existingCourseName = await CourseRepository.findOneByCondition({
        [`name.${locale}`]: parsed.data.name,
      });
      if (existingCourseName) break; // Nếu tìm thấy, dừng kiểm tra
    }

    if (!isUpdate && existingCourseName) {
      await addLogEntry({ message: "Tên khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Tên khóa học đã tồn tại" };
    }

    const existingFaculty = await FacultyRepository.findOneByCondition({
      id: parsed.data.faculty,
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
  async getListCourses(language = "vi") {
    const courses = await CourseRepository.findAll();
    if (!courses || courses.length === 0) {
      await addLogEntry({
        message: "Không tìm thấy khóa học nào",
        level: "warn",
      });
      return [];
    }
    const formattedCourses = courses.map((course) =>
      Mapper.formatCourse(course, language)
    );
    return formattedCourses;
  }

  async addCourse(data, language = "vi") {
    const validationResult = await this.validateCourse(data);

    if (!validationResult.success) {
      await addLogEntry({
        message: "Thêm tình trạng sinh viên không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: validationResult.error };
    }

    const course = validationResult.data;

    const newId = await CourseRepository.getNextId();
    const newCourse = {
      ...course,
      id: newId,
      name: new Map(),
      description: new Map(),
    };

    SUPPORTED_LOCALES.forEach((locale) => {
      newCourse.name.set(locale, data.name); // Gán giá trị `name` cho tất cả các ngôn ngữ
      newCourse.description.set(locale, data.description || ""); // Gán giá trị `description` hoặc chuỗi rỗng
    });

    await CourseRepository.create(newCourse);

    const courses = (await CourseRepository.findAll()).map((course) => {
      return Mapper.formatCourse(course, language);
    });
    await addLogEntry({
      message: "Thêm tình trạng sinh viên thành công",
      level: "info",
      action: "create",
      entity: "course",
      user: "admin",
      details: "Add new course: " + course.name,
    });

    return { success: true, message: "Thêm khóa học thành công", courses };
  }

  async updateCourse(data, language = "vi") {
    // Sử dụng hàm validateCourse để kiểm tra dữ liệu
    const validationResult = await this.validateCourse(data, true);
    if (!validationResult.success) {
      await addLogEntry({
        message: "Cập nhật khóa học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: validationResult.error };
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
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    existingCourse.name.set(language, data.name) // Gán giá trị `name` cho tất cả các ngôn ngữ
    existingCourse.description.set(language, data.description) // Gán giá trị `description` hoặc chuỗi rỗng
    
    validationResult.data.name = new Map();
    validationResult.data.description = new Map();

    validationResult.data.name = existingCourse.name;
    validationResult.data.description = existingCourse.description;

    // Cập nhật khóa học
    await CourseRepository.update(
      validationResult.data.id,
      validationResult.data,
    );
    await CourseRepository.update(validationResult.data.id, {
      name: existingCourse.name,
      description: existingCourse.description,
    });
    const courses = (await CourseRepository.findAll()).map((course) => {
      return Mapper.formatCourse(course, language);
    });

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
      throw { status: 400, message: "ID khóa học không được để trống" };
    }

    // Kiểm tra xem khóa học có tồn tại hay không
    const existingCourse = await CourseRepository.findOneByCondition({ id });
    if (!existingCourse) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    // Kiểm tra xem khóa học có đang được sử dụng bởi sinh viên hay không
    const classSection = await ClassSectionRepository.findOneByCondition({
      course: id,
    });
    if (classSection) {
      await addLogEntry({
        message: "Không thể xóa khóa học đang được sử dụng",
        level: "warn",
      });
      // Deactivate the course instead of deleting it
      await CourseRepository.update(id, { isActive: false });
      const courses = await CourseRepository.findAll();

      return {
        success: true,
        message: "Khóa học đã được vô hiệu hóa",
        courses,
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

  async getCourseById(id, language = "vi") {
    if (!id) {
      await addLogEntry({
        message: "ID khóa học không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }

    const course = await CourseRepository.findOneByCondition({ id });
    if (!course) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    return Mapper.formatCourse(course, language);
  }

  async getTranslationCourseById(courseId) {
    if (!courseId) {
      await addLogEntry({
        message: "ID khóa học không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }

    // Lấy khóa học từ cơ sở dữ liệu
    const course = await CourseRepository.findOneByCondition({ id: courseId });
    if (!course) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    // Định dạng dữ liệu bản dịch
    const translations = {
      en: {
        courseName: course.name.get("en"),
        description: course.description.get("en"),
      },
      vi: {
        courseName: course.name.get("vi"),
        description: course.description.get("vi"),
      },
    };

    return translations;
  }

  async updateTranslationCourse(courseId, translations) {
    if (!courseId) {
      await addLogEntry({
        message: "ID khóa học không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }

    // Lấy khóa học từ cơ sở dữ liệu
    const course = await CourseRepository.findOneByCondition({ id: courseId });
    if (!course) {
      await addLogEntry({
        message: "Khóa học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    // Cập nhật bản dịch
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        course.name.set(locale, translations[locale].courseName);
        course.description.set(locale, translations[locale].description);
      }
    });

    await CourseRepository.update(courseId, {
      name: course.name,
      description: course.description,
    });

    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = new CourseService();
