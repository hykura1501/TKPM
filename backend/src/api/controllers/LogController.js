const LogService = require('../services/LogService');

class LogController {
  async getListLogs(req, res) {
    try {
      const logs = await LogService.getListLogs();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách log:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách log" });
    }
  }

  async addLog(req, res) {
    try {
      const result = await LogService.addLog(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm log:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm log" });
    }
  }
}

module.exports = new LogController();