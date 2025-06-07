// FacultyController (Presentation Layer)
class FacultyController {
  constructor({
    getFacultyListUseCase,
    getFacultyByIdUseCase,
    createFacultyUseCase,
    updateFacultyUseCase,
    deleteFacultyUseCase
  }) {
    this.getFacultyListUseCase = getFacultyListUseCase;
    this.getFacultyByIdUseCase = getFacultyByIdUseCase;
    this.createFacultyUseCase = createFacultyUseCase;
    this.updateFacultyUseCase = updateFacultyUseCase;
    this.deleteFacultyUseCase = deleteFacultyUseCase;
  }

  async getListFaculties(req, res) {
    try {
      const faculties = await this.getFacultyListUseCase.execute();
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFacultyById(req, res) {
    try {
      const faculty = await this.getFacultyByIdUseCase.execute(req.params.id);
      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createFaculty(req, res) {
    try {
      const newFaculty = await this.createFacultyUseCase.execute(req.body);
      res.status(201).json(newFaculty);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateFaculty(req, res) {
    try {
      const updated = await this.updateFacultyUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteFaculty(req, res) {
    try {
      const deleted = await this.deleteFacultyUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FacultyController;
