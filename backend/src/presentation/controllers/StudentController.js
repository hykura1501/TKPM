// StudentController (Presentation Layer)
class StudentController {
  constructor({
    getStudentListUseCase,
    getStudentByIdUseCase,
    createStudentUseCase,
    updateStudentUseCase,
    deleteStudentUseCase
  }) {
    this.getStudentListUseCase = getStudentListUseCase;
    this.getStudentByIdUseCase = getStudentByIdUseCase;
    this.createStudentUseCase = createStudentUseCase;
    this.updateStudentUseCase = updateStudentUseCase;
    this.deleteStudentUseCase = deleteStudentUseCase;
  }

  async getListStudents(req, res) {
    try {
      const students = await this.getStudentListUseCase.execute();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStudentById(req, res) {
    try {
      const student = await this.getStudentByIdUseCase.execute(req.params.mssv);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createStudent(req, res) {
    try {
      const newStudent = await this.createStudentUseCase.execute(req.body);
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const updated = await this.updateStudentUseCase.execute(req.params.mssv, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const deleted = await this.deleteStudentUseCase.execute(req.params.mssv);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = StudentController;
