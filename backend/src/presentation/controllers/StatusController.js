// StatusController (Presentation Layer)
class StatusController {
  /**
   * @param {object} deps
   * @param {import('@usecases/status/GetStatusListUseCase')} deps.getStatusListUseCase
   * @param {import('@usecases/status/CreateStatusUseCase')} deps.createStatusUseCase
   * @param {import('@usecases/status/UpdateStatusUseCase')} deps.updateStatusUseCase
   * @param {import('@usecases/status/DeleteStatusUseCase')} deps.deleteStatusUseCase
   * @param {import('@usecases/status/UpdateStatusRulesUseCase')} [deps.updateStatusRulesUseCase]
   * @param {import('@usecases/status/GetStatusRulesUseCase')} [deps.getStatusRulesUseCase]
   */
  constructor({ getStatusListUseCase, createStatusUseCase, updateStatusUseCase, deleteStatusUseCase, updateStatusRulesUseCase, getStatusRulesUseCase }) {
    this.getStatusListUseCase = getStatusListUseCase;
    this.createStatusUseCase = createStatusUseCase;
    this.updateStatusUseCase = updateStatusUseCase;
    this.deleteStatusUseCase = deleteStatusUseCase;
    this.updateStatusRulesUseCase = updateStatusRulesUseCase;
    this.getStatusRulesUseCase = getStatusRulesUseCase;
  }

  async getListStatuses(req, res) {
    try {
      const statuses = await this.getStatusListUseCase.execute();
      res.status(200).json(statuses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createStatus(req, res) {
    try {
      const newStatus = await this.createStatusUseCase.execute(req.body);
      res.status(201).json(newStatus);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const updated = await this.updateStatusUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteStatus(req, res) {
    try {
      const deleted = await this.deleteStatusUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateStatusRules(req, res) {
    try {
      const result = await this.updateStatusRulesUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật quy tắc trạng thái:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật quy tắc trạng thái" });
    }
  }

  async getStatusRules(req, res) {
    try {
      const result = await this.getStatusRulesUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy quy tắc trạng thái:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy quy tắc trạng thái" });
    }
  }
}

module.exports = StatusController;
