const SettingService = require('../services/SettingService');

class SettingController {
  async updateDomains(req, res) {
    try {
      const result = await SettingService.updateDomains(req.body.domains);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật domain:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật domain" });
    }
  }

  async getDomains(req, res) {
    try {
      const result = await SettingService.getDomains();
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách domain:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách domain" });
    }
  }

  async updatePhoneFormats(req, res) {
    try {
      const result = await SettingService.updatePhoneFormats(req.body.phoneFormats);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật phone formats:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật phone formats" });
    }
  }

  async getAllSettings(req, res) {
    try {
      const result = await SettingService.getAllSettings();
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách setting:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách setting" });
    }
  }

  async getStatusRules(req, res) {
    try {
      const rules = await SettingService.getStatusRules();
      res.status(200).json(rules);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách setting:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách setting" });
    }
  }
}

module.exports = new SettingController();