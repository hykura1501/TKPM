// SemesterController (Presentation Layer)
class SemesterController {
  constructor({
    getSemesterListUseCase,
    createSemesterUseCase,
    updateSemesterUseCase,
    deleteSemesterUseCase
  }) {
    this.getSemesterListUseCase = getSemesterListUseCase;
    this.createSemesterUseCase = createSemesterUseCase;
    this.updateSemesterUseCase = updateSemesterUseCase;
    this.deleteSemesterUseCase = deleteSemesterUseCase;
  }
  async getListSemesters(req, res) {
    try {
      const semesters = await this.getSemesterListUseCase.execute();
      res.status(200).json(semesters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSemester(req, res) {
    try {
      const newSemester = await this.createSemesterUseCase.execute(req.body);
      res.status(201).json(newSemester);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateSemester(req, res) {
    try {
      const updated = await this.updateSemesterUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSemester(req, res) {
    try {
      const deleted = await this.deleteSemesterUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SemesterController;
