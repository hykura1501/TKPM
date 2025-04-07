const FacultyService = require('../services/FacultyService');

class FacultyController {
  async getListFaculties(req, res) {
    try {
      const faculties = await FacultyService.getListFaculties();
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addFaculty(req, res) {
    try {
      const result = await FacultyService.addFaculty(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateFaculty(req, res) {
    try {
      const result = await FacultyService.updateFaculty(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteFaculty(req, res) {
    try {
      const result = await FacultyService.deleteFaculty(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }
}

module.exports = new FacultyController();