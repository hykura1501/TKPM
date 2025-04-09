const RegistrationService = require('../services/RegistrationService');

class RegistrationController {
  async getListRegistrations(req, res) {
    try {
      const registrations = await RegistrationService.getListRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addRegistration(req, res) {
    try {
      const result = await RegistrationService.addRegistration(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateRegistration(req, res) {
    try {
      const result = await RegistrationService.updateRegistration(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteRegistration(req, res) {
    try {
      const result = await RegistrationService.deleteRegistration(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }
}

module.exports = new RegistrationController();