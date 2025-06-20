const Mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const FacultyRepository = require('@repositories/FacultyRepository');
const { courseSchema } = require('@validators/courseValidator');

class CreateCourseUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   */
  constructor({ courseRepository }) {
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
    this.facultyRepository = new FacultyRepository();
  }

  async validateCourse(course, isUpdate = false) {
    const parsed = courseSchema.safeParse(course);
    if (!parsed.success) {
      await addLogEntry({ 
        message: "Khóa học không hợp lệ", 
        level: "warn",
        action: 'validate',
        entity: 'course',
        user: 'admin',
        details: 'Invalid course data: ' + JSON.stringify(course)
      });
      return { success: false, error: parsed.error.errors };
    }
    const existingCourse = await this.courseRepository.findOneByCondition({ code: parsed.data.code });
    if (!isUpdate && existingCourse) {
      await addLogEntry({ 
        message: "Mã khóa học đã tồn tại", 
        level: "warn",
        action: 'validate',
        entity: 'course',
        user: 'admin',
        details: 'Duplicate course code: ' + parsed.data.code
      });
      return { success: false, error: "Mã khóa học đã tồn tại" };
    }
    let existingCourseName = null;
    for (const locale of SUPPORTED_LOCALES) {
      existingCourseName = await this.courseRepository.findOneByCondition({ [`name.${locale}`]: parsed.data.name });
      if (existingCourseName) break;
    }
    if (!isUpdate && existingCourseName) {
      await addLogEntry({ 
        message: "Tên khóa học đã tồn tại", 
        level: "warn",
        action: 'validate',
        entity: 'course',
        user: 'admin',
        details: 'Duplicate course name: ' + parsed.data.name
      });
      return { success: false, error: "Tên khóa học đã tồn tại" };
    }
    const existingFaculty = await this.facultyRepository.findOneByCondition({ id: parsed.data.faculty });
    if (!existingFaculty) {
      await addLogEntry({ 
        message: "Khoa phụ trách không tồn tại", 
        level: "warn",
        action: 'validate',
        entity: 'course',
        user: 'admin',
        details: 'Faculty not found: ' + parsed.data.faculty
      });
      return { success: false, error: "Khoa phụ trách không tồn tại" };
    }
    return { success: true, data: parsed.data };
  }

  async execute(data, language = 'vi') {
    const validationResult = await this.validateCourse(data);
    if (!validationResult.success) {
      await addLogEntry({ 
        message: "Thêm tình trạng sinh viên không hợp lệ", 
        level: "warn",
        action: 'create',
        entity: 'course',
        user: 'admin',
        details: 'Invalid course data: ' + JSON.stringify(data)
      });
      throw { status: 400, message: validationResult.error };
    }
    const course = validationResult.data;
    const newId = await this.courseRepository.getNextId();
    const newCourse = {
      ...course,
      id: newId,
      name: new Map(),
      description: new Map(),
    };
    SUPPORTED_LOCALES.forEach((locale) => {
      newCourse.name.set(locale, data.name);
      newCourse.description.set(locale, data.description || "");
    });
    await this.courseRepository.create(newCourse);
    const courses = (await this.courseRepository.findAll()).map((course) => Mapper.formatCourse(course, language));
    await addLogEntry({ 
      message: "Thêm khóa học thành công", 
      level: "info",
      action: "create",
      entity: "course",
      user: "admin",
      details: "Add new course: " + course.name
    });
    return { success: true, message: "Thêm khóa học thành công", courses };
  }
}

module.exports = CreateCourseUseCase;
