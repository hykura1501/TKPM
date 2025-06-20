const { addLogEntry } = require('@shared/utils/logging');
const mapper = require('@shared/utils/mapper');

// Use case: Get course by id
class GetCourseByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   */
  constructor({ courseRepository }) {
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
  }

  async execute(id, language = 'vi'){
    if (!id) {
      await addLogEntry({ 
        message: "ID khóa học không được để trống", 
        level: "warn",
        action: 'get',
        entity: 'course',
        user: 'admin',
        details: 'Empty id provided for get by id'
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }

    const course = await this.courseRepository.findOneByCondition({ id });
    if (!course) {
      await addLogEntry({ 
        message: "Khóa học không tồn tại", 
        level: "warn",
        action: 'get',
        entity: 'course',
        user: 'admin',
        details: 'Course not found: ' + id
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }

    return mapper.formatCourse(course, language);
  }
}

module.exports = GetCourseByIdUseCase;
