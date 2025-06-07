// Use case: Delete a status
const { addLogEntry } = require('@helpers/logging');

class DeleteStatusUseCase {
  constructor({ statusRepository, studentRepository }) {
    this.statusRepository = statusRepository;
    this.studentRepository = studentRepository;
  }

  async execute(id) {
    if (!id) {
      await addLogEntry({ message: 'ID không được để trống', level: 'warn' });
      throw { status: 400, message: 'ID không được để trống' };
    }
    // Kiểm tra xem có sinh viên nào đang dùng status này không
    const student = await this.studentRepository.findOneByCondition({ status: id });
    if (student) {
      await addLogEntry({ message: 'Không thể xóa tình trạng sinh viên đang được sử dụng', level: 'warn' });
      throw { status: 400, message: 'Không thể xóa tình trạng sinh viên đang được sử dụng' };
    }
    await this.statusRepository.delete(id);
    await addLogEntry({ message: 'Xóa tình trạng sinh viên thành công', level: 'info', action: 'delete', entity: 'status', user: 'admin', details: `Deleted status: ${id}` });
    return { success: true };
  }
}

module.exports = DeleteStatusUseCase;

