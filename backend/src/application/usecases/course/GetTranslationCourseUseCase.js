const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class GetTranslationCourseUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   */
  constructor({ courseRepository }) {
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
  }

  async execute(courseId) {
    if (!courseId) {
      await addLogEntry({ 
        message: "ID khóa học không được để trống", 
        level: "warn",
        action: 'get-translation',
        entity: 'course',
        user: 'admin',
        details: 'Empty courseId provided for get translation'
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const course = await this.courseRepository.findOneByCondition({ id: courseId });
    if (!course) {
      await addLogEntry({ 
        message: "Khóa học không tồn tại", 
        level: "warn",
        action: 'get-translation',
        entity: 'course',
        user: 'admin',
        details: 'Course not found: ' + courseId
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    const translations = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      translations[locale] = {
        courseName: course.name.get(locale),
        description: course.description.get(locale),
      };
    });
    // const translations = {
    //   en: {
    //     courseName: course.name.get("en"),
    //     description: course.description.get("en"),
    //   },
    //   vi: {
    //     courseName: course.name.get("vi"),
    //     description: course.description.get("vi"),
    //   },
    // };
    return translations;
  }
}

module.exports = GetTranslationCourseUseCase;
