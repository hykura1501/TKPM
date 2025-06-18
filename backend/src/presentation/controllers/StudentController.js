// StudentController (Presentation Layer)
const { Parser: Json2csvParser } = require('json2csv');
const ExcelJS = require('exceljs');
const js2xmlparser = require('js2xmlparser');

class StudentController {
  /**
   * 
   * @param {object} deps
   * @param {import('@usecases/student/GetStudentListUseCase')} deps.getStudentListUseCase
   * @param {import('@usecases/student/GetStudentByIdUseCase')} deps.getStudentByIdUseCase
   * @param {import('@usecases/student/CreateStudentUseCase')} deps.createStudentUseCase
   * @param {import('@usecases/student/UpdateStudentUseCase')} deps.updateStudentUseCase
   * @param {import('@usecases/student/DeleteStudentUseCase')} deps.deleteStudentUseCase
   * @param {import('@usecases/student/AddStudentsFromFileUseCase')} deps.addStudentsFromFileUseCase
   * @param {import('@usecases/student/AddStudentFromFileUseCase')} deps.addStudentFromFileUseCase
   * @param {import('@usecases/student/GetGradeByStudentIdUseCase')} deps.getGradeByStudentIdUseCase
   * @param {import('@usecases/student/ExportStudentListUseCase')} deps.exportStudentListUseCase
   * @param {import('@usecases/student/ImportStudentsFromFileUseCase')} deps.importStudentsFromFileUseCase
   */
  constructor({
    getStudentListUseCase,
    getStudentByIdUseCase,
    createStudentUseCase,
    updateStudentUseCase,
    deleteStudentUseCase,
    addStudentsFromFileUseCase,
    addStudentFromFileUseCase,
    getGradeByStudentIdUseCase,
    exportStudentListUseCase,
    importStudentsFromFileUseCase
  }) {
    this.getStudentListUseCase = getStudentListUseCase;
    this.getStudentByIdUseCase = getStudentByIdUseCase;
    this.createStudentUseCase = createStudentUseCase;
    this.updateStudentUseCase = updateStudentUseCase;
    this.deleteStudentUseCase = deleteStudentUseCase;
    this.addStudentsFromFileUseCase = addStudentsFromFileUseCase;
    this.addStudentFromFileUseCase = addStudentFromFileUseCase;
    this.getGradeByStudentIdUseCase = getGradeByStudentIdUseCase;
    this.exportStudentListUseCase = exportStudentListUseCase;
    this.importStudentsFromFileUseCase = importStudentsFromFileUseCase;
  }

  async getListStudents(req, res) {
    try {
      const students = await this.getStudentListUseCase.execute();
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
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
      console.error("Lỗi khi lấy thông tin sinh viên:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async createStudent(req, res) {
    try {
      const newStudent = await this.createStudentUseCase.execute(req.body);
      res.status(201).json(newStudent);
    } catch (error) {
      console.error("Lỗi khi tạo sinh viên:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const updated = await this.updateStudentUseCase.execute(req.body);
      res.status(200).json(updated);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin sinh viên:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const deleted = await this.deleteStudentUseCase.execute(req.params.mssv);
      res.status(200).json(deleted);
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      res.status(400).json({ error: error.message });
    }
  }
  async addStudentsFromFile(req, res) {
    try {
      const newStudents = await this.addStudentsFromFileUseCase.execute(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        students: newStudents,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message && error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async addStudentFromFile(req, res) {
    try {
      const newStudent = await this.addStudentFromFileUseCase.execute(req.body, req.query.language || "vi");
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        student: newStudent,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message && error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async getGradeByStudentId(req, res) {
    try {
      const grades = await this.getGradeByStudentIdUseCase.execute(req.params.studentId, req.query.language || "vi");
      res.status(200).json(grades);
    } catch (error) {
      console.error("Lỗi khi lấy điểm của sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy điểm của sinh viên" });
    }
  }

  async exportStudentList(req, res) {
    try {
      const format = req.query.format || 'json';
      if (!['csv', 'excel', 'xml', 'json'].includes(format)) {
        return res.status(400).json({ error: "Định dạng file không hợp lệ. Chỉ hỗ trợ csv, excel, xml hoặc json." });
      }
      const { fileContent, fileName, contentType, isExcel } = await this.exportStudentListUseCase.execute({ format, locale: req.language });
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); // <-- expose header cho FE lấy tên file
      if (isExcel) {
        await fileContent.xlsx.write(res);
        return res.end();
      }
      res.send(fileContent);
    } catch (err) {
      console.error("Lỗi khi xuất danh sách sinh viên:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async importStudentsFromFile(req, res) {
    try {
      const format = req.query.format || 'json';
      if (!req.file) {
        return res.status(400).json({ error: "Vui lòng tải lên file" });
      }
      if (!['json', 'xml'].includes(format)) {
        return res.status(400).json({ error: "Định dạng file không hợp lệ. Chỉ hỗ trợ json hoặc xml." });
      }
      const fileContent = req.file.buffer.toString();
      const result = await this.importStudentsFromFileUseCase.execute({ fileContent, fileType: format });
      res.status(200).json({
        message: "Import sinh viên hoàn tất",
        imported: result.imported,
        errors: result.errors
      });
    } catch (error) {
      console.error("Lỗi khi import sinh viên từ file:", error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = StudentController;
