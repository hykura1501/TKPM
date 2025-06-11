// CourseController (Presentation Layer)
class CourseController {
  constructor({
    getCourseListUseCase,
    createCourseUseCase,
    updateCourseUseCase,
    deleteCourseUseCase,
    getTranslationCourseUseCase,
    updateTranslationCourseUseCase
  }) {
    this.getCourseListUseCase = getCourseListUseCase;
    this.createCourseUseCase = createCourseUseCase;
    this.updateCourseUseCase = updateCourseUseCase;
    this.deleteCourseUseCase = deleteCourseUseCase;
    this.getTranslationCourseUseCase = getTranslationCourseUseCase;
    this.updateTranslationCourseUseCase = updateTranslationCourseUseCase;
  }

  async getListCourses(req, res) {
    try {
      const courses = await this.getCourseListUseCase.execute(req.language);
      res.status(200).json(courses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addCourse(req, res) {
    try {
      const result = await this.createCourseUseCase.execute(req.body, req.language);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateCourse(req, res) {
    try {
      const result = await this.updateCourseUseCase.execute(req.body, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteCourse(req, res) {
    try {
      const result = await this.deleteCourseUseCase.execute(req.params.id, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }

  async getTranslationCourse(req, res) {
    try {
      const result = await this.getTranslationCourseUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async updateTranslationCourse(req, res) {
    try {
      const result = await this.updateTranslationCourseUseCase.execute(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }
}

module.exports = CourseController;

