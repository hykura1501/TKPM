const SemesterService = require('../services/SemesterService');

class SemesterController {
  async getListSemesters(req, res) {
    try {
      const semesters = await SemesterService.getListSemesters();
      res.status(200).json(semesters);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addSemester(req, res) {
    try {
      const result = await SemesterService.addSemester(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateSemester(req, res) {
    try {
      const result = await SemesterService.updateSemester(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteSemester(req, res) {
    try {
      const result = await SemesterService.deleteSemester(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }
}

module.exports = new SemesterController();