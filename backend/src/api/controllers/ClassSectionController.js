const ClassSectionService = require('../services/ClassSectionService');

class ClassSectionController {
  async getListClassSections(req, res) {
    try {
      const classSections = await ClassSectionService.getListClassSections();
      res.status(200).json(classSections);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addClassSection(req, res) {
    try {
      const result = await ClassSectionService.addClassSection(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateClassSection(req, res) {
    try {
      const result = await ClassSectionService.updateClassSection(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteClassSection(req, res) {
    try {
      const result = await ClassSectionService.deleteClassSection(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }

  async getClassSectionByCourseId(req, res) { 
    try {
      const { courseId } = req.params;
      const classSections = await ClassSectionService.getClassSectionByCourseId(courseId);
      res.status(200).json(classSections);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }
}

module.exports = new ClassSectionController();