// CourseController (Presentation Layer)
class CourseController {
  constructor({ getCourseListUseCase }) {
    this.getCourseListUseCase = getCourseListUseCase;
  }

  async getListCourses(req, res) {
    try {
      const courses = await this.getCourseListUseCase.execute();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CourseController;

