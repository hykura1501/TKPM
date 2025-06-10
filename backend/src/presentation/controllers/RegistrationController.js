// RegistrationController (Presentation Layer)
class RegistrationController {
  constructor({
    getRegistrationListUseCase,
    getRegistrationByIdUseCase,
    createRegistrationUseCase,
    updateRegistrationUseCase,
    deleteRegistrationUseCase,
    cancelRegistrationUseCase,
    getGradeByClassIdUseCase,
    saveGradeByClassIdUseCase,
    getGradeByStudentIdUseCase
  }) {
    this.getRegistrationListUseCase = getRegistrationListUseCase;
    this.getRegistrationByIdUseCase = getRegistrationByIdUseCase;
    this.createRegistrationUseCase = createRegistrationUseCase;
    this.updateRegistrationUseCase = updateRegistrationUseCase;
    this.deleteRegistrationUseCase = deleteRegistrationUseCase;
    this.cancelRegistrationUseCase = cancelRegistrationUseCase;
    this.getGradeByClassIdUseCase = getGradeByClassIdUseCase;
    this.saveGradeByClassIdUseCase = saveGradeByClassIdUseCase;
    this.getGradeByStudentIdUseCase = getGradeByStudentIdUseCase;
  }
  async getListRegistrations(req, res) {
    try {
      const registrations = await this.getRegistrationListUseCase.execute();
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRegistrationById(req, res) {
    try {
      const registration = await this.getRegistrationByIdUseCase.execute(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.status(200).json(registration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRegistration(req, res) {
    try {
      const newRegistration = await this.createRegistrationUseCase.execute(req.body);
      res.status(201).json(newRegistration);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRegistration(req, res) {
    try {
      const updated = await this.updateRegistrationUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRegistration(req, res) {
    try {
      const deleted = await this.deleteRegistrationUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async cancelRegistration(req, res) {
    try {
      const result = await this.cancelRegistrationUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi hủy đăng ký học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi hủy đăng ký học" });
    }
  }

  async getGradeByClassId(req, res) {
    try {
      const { classId } = req.params;
      const grades = await this.getGradeByClassIdUseCase.execute(classId);
      // Nếu muốn lấy thêm studentInfo, cần inject StudentUseCase và join ở đây
      res.status(200).json(grades);
    } catch (error) {
      console.error("Lỗi khi lấy điểm theo lớp:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy điểm theo lớp" });
    }
  }

  async saveGradeByClassId(req, res) {
    try {
      const { classId } = req.params;
      const { grades } = req.body;
      const result = await this.saveGradeByClassIdUseCase.execute(classId, grades);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lưu điểm theo lớp:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lưu điểm theo lớp" });
    }
  }
}

module.exports = RegistrationController;
