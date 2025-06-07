const Mapper = require('@helpers/Mapper');
const { addLogEntry } = require('@helpers/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const FacultyRepository = require('@repositories/FacultyRepository');
const { courseSchema } = require('@validators/courseValidator');

class UpdateCourseUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
    this.facultyRepository = new FacultyRepository();
  }

  async validateCourse(course, isUpdate = false) {
    const parsed = courseSchema.safeParse(course);
    if (!parsed.success) {
      await addLogEntry({ message: "Khóa học không hợp lệ", level: "warn" });
      return { success: false, error: parsed.error.errors.message };
    }
    const existingCourse = await this.courseRepository.findOneByCondition({ code: parsed.data.code });
    if (!isUpdate && existingCourse) {
      await addLogEntry({ message: "Mã khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Mã khóa học đã tồn tại" };
    }
    let existingCourseName = null;
    for (const locale of SUPPORTED_LOCALES) {
      existingCourseName = await this.courseRepository.findOneByCondition({ [`name.${locale}`]: parsed.data.name });
      if (existingCourseName) break;
    }
    if (!isUpdate && existingCourseName) {
      await addLogEntry({ message: "Tên khóa học đã tồn tại", level: "warn" });
      return { success: false, error: "Tên khóa học đã tồn tại" };
    }
    const existingFaculty = await this.facultyRepository.findOneByCondition({ id: parsed.data.faculty });
    if (!existingFaculty) {
      await addLogEntry({ message: "Khoa phụ trách không tồn tại", level: "warn" });
      return { success: false, error: "Khoa phụ trách không tồn tại" };
    }
    return { success: true, data: parsed.data };
  }

  async execute(data, language = 'vi') {
    const validationResult = await this.validateCourse(data, true);
    if (!validationResult.success) {
      await addLogEntry({ message: "Cập nhật khóa học không hợp lệ", level: "warn" });
      throw { status: 400, message: validationResult.error };
    }
    const existingCourse = await this.courseRepository.findOneByCondition({ id: validationResult.data.id });
    if (!existingCourse) {
      await addLogEntry({ message: "Khóa học không tồn tại", level: "warn" });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    existingCourse.name.set(language, data.name);
    existingCourse.description.set(language, data.description);
    validationResult.data.name = new Map();
    validationResult.data.description = new Map();
    validationResult.data.name = existingCourse.name;
    validationResult.data.description = existingCourse.description;
    await this.courseRepository.update(validationResult.data.id, validationResult.data);
    await this.courseRepository.update(validationResult.data.id, {
      name: existingCourse.name,
      description: existingCourse.description,
    });
    const courses = (await this.courseRepository.findAll()).map((course) => Mapper.formatCourse(course, language));
    await addLogEntry({ message: "Cập nhật khóa học thành công", level: "info", action: "update", entity: "course", user: "admin", details: "Updated course: " + validationResult.data.name });
    return { success: true, message: "Cập nhật khóa học thành công", courses };
  }
}

module.exports = UpdateCourseUseCase;
