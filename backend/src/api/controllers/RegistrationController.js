const RegistrationService = require('../services/RegistrationService');
const StudentService = require('../services/StudentService');

class RegistrationController {
  async getListRegistrations(req, res) {
    try {
      const registrations = await RegistrationService.getListRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khoa:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách khoa" });
    }
  }

  async addRegistration(req, res) {
    try {
      const result = await RegistrationService.addRegistration(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi thêm khoa" });
    }
  }

  async updateRegistration(req, res) {
    try {
      const result = await RegistrationService.updateRegistration(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật khoa" });
    }
  }

  async deleteRegistration(req, res) {
    try {
      const result = await RegistrationService.deleteRegistration(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }
  async cancelRegistration(req, res) {
    try {
      const result = await RegistrationService.cancelRegistration(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa khoa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa khoa" });
    }
  }

  async getGradeByClassId(req, res) {
    try {
      const { classId } = req.params;
      console.log(classId);
      
      const grades = await RegistrationService.getGradeByClassId(classId);
      
      const _grades = grades.map((item) => item.toJSON());

      for (let item of _grades) {
        const student = (await StudentService.getStudentByMssv(item.studentId)).toJSON();
        if (student) {
          item.studentInfo = student;
        }
      }

      res.status(200).json(_grades);
    } catch (error) {
      console.error("Lỗi khi lấy điểm theo lớp:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy điểm theo lớp" });
    }
  }

  async saveGradeByClassId(req, res) {
    try {
      const { classId } = req.params;
      const { grades } = req.body;
      const result = await RegistrationService.saveGradeByClassId(classId, grades);
      res.status(200).json(result);
    } catch (error) {
      
    }
  }
}

module.exports = new RegistrationController();