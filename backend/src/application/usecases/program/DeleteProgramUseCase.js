// Use case: Delete a program
const { addLogEntry } = require('@helpers/logging');

class DeleteProgramUseCase {
  constructor({ programRepository, studentRepository }) {
    this.programRepository = programRepository;
    this.studentRepository = studentRepository;
  }

  async execute(id) {
    if (!id) {
      await addLogEntry({ message: 'ID không được để trống', level: 'warn' });
      throw { status: 400, message: 'ID không được để trống' };
    }
    // Kiểm tra xem có sinh viên nào đang dùng chương trình này không
    const students = await this.studentRepository.findOneByCondition({ program: id });
    if (students) {
      await addLogEntry({ message: 'Không thể xóa chương trình học', level: 'warn' });
      throw { status: 400, message: 'Không thể xóa chương trình học' };
    }
    await this.programRepository.delete(id);
    await addLogEntry({ message: 'Xóa chương trình học thành công', level: 'info', action: 'delete', entity: 'program', user: 'admin', details: 'Deleted program: ' + id });
    return { success: true };
  }
}

module.exports = DeleteProgramUseCase;

