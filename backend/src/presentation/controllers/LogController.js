// LogController (Presentation Layer)
class LogController {
  constructor({ getLogListUseCase }) {
    this.getLogListUseCase = getLogListUseCase;
  }
  async getListLogs(req, res) {
    try {
      const logs = await this.getLogListUseCase.execute();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LogController;
