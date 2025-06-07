// StatusController (Presentation Layer)
class StatusController {
  constructor({
    getStatusListUseCase,
    createStatusUseCase,
    updateStatusUseCase,
    deleteStatusUseCase
  }) {
    this.getStatusListUseCase = getStatusListUseCase;
    this.createStatusUseCase = createStatusUseCase;
    this.updateStatusUseCase = updateStatusUseCase;
    this.deleteStatusUseCase = deleteStatusUseCase;
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
}

module.exports = StatusController;
