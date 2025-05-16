const CourseService = require('../services/CourseService');

class CourseController {
  async getListCourses(req, res) {
    try {
      const Courses = await CourseService.getListCourses(req.language);
      res.status(200).json(Courses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addCourse(req, res) {
    try {
      const result = await CourseService.addCourse(req.body, req.language);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateCourse(req, res) {
    try {
      const result = await CourseService.updateCourse(req.body, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteCourse(req, res) {
    try {
      const result = await CourseService.deleteCourse(req.params.id, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }

  async getTranslationCourse(req, res) {
    try {
      const result = await CourseService.getTranslationCourseById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async updateTranslationCourse(req, res) {
    try {
      const result = await CourseService.updateTranslationCourse(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }
}

module.exports = new CourseController();