const { SUPPORTED_LOCALES } = require('@configs/locales');

class UpdateTranslationCourseUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute(courseId, translations) {
    if (!courseId) {
      await addLogEntry({ message: "ID khóa học không được để trống", level: "warn" });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const course = await this.courseRepository.findOneByCondition({ id: courseId });
    if (!course) {
      await addLogEntry({ message: "Khóa học không tồn tại", level: "warn" });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        course.name.set(locale, translations[locale].courseName);
        course.description.set(locale, translations[locale].description);
      }
    });
    await this.courseRepository.update(courseId, {
      name: course.name,
      description: course.description,
    });
    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = UpdateTranslationCourseUseCase;
