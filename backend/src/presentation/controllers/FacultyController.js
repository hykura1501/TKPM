// FacultyController (Presentation Layer)
class FacultyController {
  constructor({
    getFacultyListUseCase,
    getFacultyByIdUseCase,
    createFacultyUseCase,
    updateFacultyUseCase,
    deleteFacultyUseCase,
    getTranslationFacultyUseCase,
    updateTranslationFacultyUseCase
  }) {
    this.getFacultyListUseCase = getFacultyListUseCase;
    this.getFacultyByIdUseCase = getFacultyByIdUseCase;
    this.createFacultyUseCase = createFacultyUseCase;
    this.updateFacultyUseCase = updateFacultyUseCase;
    this.deleteFacultyUseCase = deleteFacultyUseCase;
    this.getTranslationFacultyUseCase = getTranslationFacultyUseCase;
    this.updateTranslationFacultyUseCase = updateTranslationFacultyUseCase;
  }

  async getListFaculties(req, res) {
    try {
      const faculties = await this.getFacultyListUseCase.execute(req.language, req.query.lang);
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
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
      const result = await this.createFacultyUseCase.execute(req.body, req.language);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateFaculty(req, res) {
    try {
      const result = await this.updateFacultyUseCase.execute(req.body, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteFaculty(req, res) {
    try {
      const result = await this.deleteFacultyUseCase.execute(req.params.id, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }
  async getTranslationFaculty(req, res) {
    try {
      const result = await this.getTranslationFacultyUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async updateTranslationFaculty(req, res) {
    try {
      const result = await this.updateTranslationFacultyUseCase.execute(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }
}

module.exports = FacultyController;
