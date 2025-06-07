const Mapper = require('@helpers/mapper');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class GetCourseListUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute(language = 'vi') {
    const courses = await this.courseRepository.findAll();
    if (!courses || courses.length === 0) {
      await addLogEntry({ message: "Không tìm thấy khóa học nào", level: "warn" });
      return [];
    }
    return courses.map((course) => Mapper.formatCourse(course, language));
  }
}

module.exports = GetCourseListUseCase;
