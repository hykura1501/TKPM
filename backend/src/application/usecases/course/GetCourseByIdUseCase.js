// Use case: Get course by id
class GetCourseByIdUseCase {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute(id, language = 'vi', { Mapper, addLogEntry } = {}) {
    if (!id) {
      if (addLogEntry) await addLogEntry({ message: "ID khóa học không được để trống", level: "warn" });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const course = await this.courseRepository.findOneByCondition({ id });
    if (!course) {
      if (addLogEntry) await addLogEntry({ message: "Khóa học không tồn tại", level: "warn" });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    if (Mapper) {
      return Mapper.formatCourse(course, language);
    }
    return course;
  }
}

module.exports = GetCourseByIdUseCase;
