// ProgramController (Presentation Layer)
class ProgramController {
  constructor({
    getProgramListUseCase,
    getProgramByIdUseCase,
    createProgramUseCase,
    updateProgramUseCase,
    deleteProgramUseCase
  }) {
    this.getProgramListUseCase = getProgramListUseCase;
    this.getProgramByIdUseCase = getProgramByIdUseCase;
    this.createProgramUseCase = createProgramUseCase;
    this.updateProgramUseCase = updateProgramUseCase;
    this.deleteProgramUseCase = deleteProgramUseCase;
  }
  async getListPrograms(req, res) {
    try {
      const programs = await this.getProgramListUseCase.execute();
      res.status(200).json(programs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProgramById(req, res) {
    try {
      const program = await this.getProgramByIdUseCase.execute(req.params.id);
      if (!program) {
        return res.status(404).json({ error: 'Program not found' });
      }
      res.status(200).json(program);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProgram(req, res) {
    try {
      const newProgram = await this.createProgramUseCase.execute(req.body);
      res.status(201).json(newProgram);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProgram(req, res) {
    try {
      const updated = await this.updateProgramUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProgram(req, res) {
    try {
      const deleted = await this.deleteProgramUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProgramController;
