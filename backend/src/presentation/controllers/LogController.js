// LogController (Presentation Layer)
class LogController {
  constructor({ getLogListUseCase, addLogUseCase }) {
    this.getLogListUseCase = getLogListUseCase;
    this.addLogUseCase = addLogUseCase;
  }
  async getListLogs(req, res) {
    try {
      const logs = await this.getLogListUseCase.execute();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addLog(req, res) {
    try {
      const result = await this.addLogUseCase.execute(req.body);
      res.status(201).json(result);
     } catch (error) {
      console.error("Lỗi khi thêm log:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm log" });
    }
  }
}

module.exports = LogController;
