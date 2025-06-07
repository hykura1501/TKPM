// Use case: Create a new student
const { studentSchema } = require('@validators/studentValidator');
const { addLogEntry } = require('@helpers/logging');

class CreateStudentUseCase {
  constructor({ studentRepository }) {
    this.studentRepository = studentRepository;
  }

  async execute(studentData) {
    // Validate input
    const parsed = studentSchema.safeParse(studentData);
    if (!parsed.success) {
      await addLogEntry({ message: 'Dữ liệu sinh viên không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    // Check duplicate MSSV
    if (studentData.mssv) {
      const existing = await this.studentRepository.findStudentByMssv(studentData.mssv);
      if (existing) {
        await addLogEntry({ message: 'MSSV đã tồn tại', level: 'warn' });
        throw { status: 400, message: 'MSSV đã tồn tại' };
      }
    }
    // Create student
    const created = await this.studentRepository.createStudent(parsed.data);
    await addLogEntry({ message: 'Thêm sinh viên thành công', level: 'info', action: 'create', entity: 'student', user: 'admin', details: `Add new student: ${parsed.data.fullName}` });
    return created;
  }
}

module.exports = CreateStudentUseCase;

