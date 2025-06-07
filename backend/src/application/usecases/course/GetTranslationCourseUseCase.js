const { SUPPORTED_LOCALES } = require('@configs/locales');

class GetTranslationCourseUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute(courseId) {
    if (!courseId) {
      await addLogEntry({ message: "ID khóa học không được để trống", level: "warn" });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const course = await this.courseRepository.findOneByCondition({ id: courseId });
    if (!course) {
      await addLogEntry({ message: "Khóa học không tồn tại", level: "warn" });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
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
}

module.exports = GetTranslationCourseUseCase;
