// Use case: Delete a student
const { addLogEntry } = require('@shared/utils/logging');

class DeleteStudentUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ studentRepository }) {
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute(mssv) {
    if (!mssv) {
      await addLogEntry({ 
        message: 'MSSV không được để trống', 
        level: 'warn',
        action: 'delete',
        entity: 'student',
        user: 'admin',
        details: 'Empty mssv provided for delete'
      });
      throw { status: 400, message: 'MSSV không được để trống' };
    }
    const student = await this.studentRepository.findStudentByMssv(mssv);
    if (!student) {
      await addLogEntry({ 
        message: 'Sinh viên không tồn tại', 
        level: 'warn',
        action: 'delete',
        entity: 'student',
        user: 'admin',
        details: 'Student not found: ' + mssv
      });
      throw { status: 404, message: 'Sinh viên không tồn tại' };
    }
    await this.studentRepository.deleteStudent(mssv);
    await addLogEntry({ message: 'Xóa sinh viên thành công', level: 'info', action: 'delete', entity: 'student', user: 'admin', details: `Deleted student: ${mssv}` });
    return { success: true };
  }
}

module.exports = DeleteStudentUseCase;

