// ProgramController (Presentation Layer)
class ProgramController {
  /**
   * @param {object} deps
   * @param {import('@usecases/program/GetProgramListUseCase')} deps.getProgramListUseCase
   * @param {import('@usecases/program/CreateProgramUseCase')} deps.createProgramUseCase
   * @param {import('@usecases/program/UpdateProgramUseCase')} deps.updateProgramUseCase
   * @param {import('@usecases/program/DeleteProgramUseCase')} deps.deleteProgramUseCase
   * @param {import('@usecases/program/GetTranslationProgramByIdUseCase')} deps.getTranslationProgramByIdUseCase
   * @param {import('@usecases/program/UpdateTranslationProgramUseCase')} deps.updateTranslationProgramUseCase
   */
  constructor({ getProgramListUseCase, createProgramUseCase, updateProgramUseCase, deleteProgramUseCase, getTranslationProgramByIdUseCase, updateTranslationProgramUseCase }) {
    this.getProgramListUseCase = getProgramListUseCase;
    this.createProgramUseCase = createProgramUseCase;
    this.updateProgramUseCase = updateProgramUseCase;
    this.deleteProgramUseCase = deleteProgramUseCase;
    this.getTranslationProgramByIdUseCase = getTranslationProgramByIdUseCase;
    this.updateTranslationProgramUseCase = updateTranslationProgramUseCase;
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
  async getTranslationProgramById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.getTranslationProgramByIdUseCase.execute(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy bản dịch chương trình học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy bản dịch chương trình học" });
    }
  }

  async updateTranslationProgram(req, res) {
    try {
      const { id } = req.params;
      const result = await this.updateTranslationProgramUseCase.execute(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật bản dịch chương trình học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật bản dịch chương trình học" });
    }
  }
}

module.exports = ProgramController;
