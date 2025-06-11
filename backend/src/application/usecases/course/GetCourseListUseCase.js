const { addLogEntry } = require('@shared/utils/logging');
const mapper = require('@shared/utils/mapper');

class GetCourseListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   */
  constructor({ courseRepository }) {
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
  }

  async execute(language = 'vi') {
    const courses = await this.courseRepository.findAll();
    if (!courses || courses.length === 0) {
      await addLogEntry({ message: "Không tìm thấy khóa học nào", level: "warn" });
      return [];
    }
    return courses.map((course) => mapper.formatCourse(course, language));
  }
}

module.exports = GetCourseListUseCase;
