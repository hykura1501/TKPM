const StudentService = require("../services/StudentService");

class StudentController {
  async getListStudents(req, res) {
    try {
      const students = await StudentService.getListStudents();
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách sinh viên" });
    }
  }

  async addStudent(req, res) {
    try {
      const newStudent = await StudentService.addStudent(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        student: newStudent,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async updateStudent(req, res) {
    try {
      await StudentService.updateStudent(req.body);
      res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật sinh viên:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async deleteStudent(req, res) {
    try {
      await StudentService.deleteStudent(req.params.mssv);
      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async addStudentsFromFile(req, res) {
    try {
      const newStudents = await StudentService.addStudentsFromFile(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        students: newStudents,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async addStudentFromFile(req, res) {
    try {
      const newStudent = await StudentService.addStudentFromFile(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        student: newStudent,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }
}

module.exports = new StudentController();