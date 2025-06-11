// Use case: Delete a status
const { addLogEntry } = require('@shared/utils/logging');

class DeleteStatusUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ statusRepository, studentRepository }) {
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute(id, language = 'vi') {
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
    const statuses = (await this.statusRepository.findAll()).map((status) => require('@shared/utils/mapper').formatStatus(status, language));
    await addLogEntry({ message: 'Xóa tình trạng sinh viên thành công', level: 'info', action: 'delete', entity: 'status', user: 'admin', details: `Deleted status: ${id}` });
    return { message: 'Xóa tình trạng sinh viên thành công', statuses };
  }
}

module.exports = DeleteStatusUseCase;

