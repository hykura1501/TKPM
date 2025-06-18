const StatusService = require('../services/StatusService');

class StatusController {
  async getListStatuses(req, res) {
    try {
      const statuses = await StatusService.getListStatuses(req.language);
      res.status(200).json(statuses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tình trạng sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách tình trạng sinh viên" });
    }
  }

  async addStatus(req, res) {
    try {
      const result = await StatusService.addStatus(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm tình trạng sinh viên:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm tình trạng sinh viên" });
    }
  }

  async updateStatus(req, res) {
    try {
      const result = await StatusService.updateStatus(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật tình trạng sinh viên:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật tình trạng sinh viên" });
    }
  }

  async deleteStatus(req, res) {
    try {
      const result = await StatusService.deleteStatus(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa tình trạng sinh viên:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa tình trạng sinh viên" });
    }
  }

  async updateStatusRules(req, res) {
    try {
      const result = await StatusService.updateStatusRules(req.body.statusTransitionsRules);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm quy tắc cho trạng thái:", error);
      res.status(500).json({ error: "Lỗi khi thêm quy tắc cho trạng thái" });
    }
  }

  async getStatusRules(req, res) {
    try {
      const rules = await StatusService.getStatusRules();
      res.status(200).json(rules);
    } catch (error) {
      console.error("Lỗi khi lấy quy tắc trạng thái:", error);
      res.status(500).json({ error: "Lỗi khi lấy quy tắc trạng thái" });
    }
  }

  async getTranslationStatus(req, res) {
    try {
      const result = await StatusService.getTranslationStatusById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy bản dịch tình trạng sinh viên:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy bản dịch tình trạng sinh viên" });
    }
  }

  async updateTranslationStatus(req, res) {
    try {
      const result = await StatusService.updateTranslationStatus(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật bản dịch tình trạng sinh viên:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật bản dịch tình trạng sinh viên" });
    }
  }
}

module.exports = new StatusController();