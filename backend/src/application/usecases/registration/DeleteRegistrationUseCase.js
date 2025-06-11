// Use case: Delete a registration
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class DeleteRegistrationUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ registrationRepository, studentRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ message: 'ID đăng ký học không được để trống', level: 'warn' });
      throw { status: 400, message: 'ID đăng ký học không được để trống' };
    }
    // Kiểm tra xem đăng ký có đang được sử dụng bởi sinh viên không
    const student = await this.studentRepository.findOneByCondition({ registration: id });
    if (student) {
      await addLogEntry({ message: 'Không thể xóa đăng ký học đang được sử dụng', level: 'warn' });
      throw { status: 400, message: 'Không thể xóa đăng ký học đang được sử dụng' };
    }
    await this.registrationRepository.delete(id);
    const registrations = await this.registrationRepository.findAll();
    await addLogEntry({ message: 'Xóa đăng ký học thành công', level: 'info', action: 'delete', entity: 'registration', user: 'admin', details: `Deleted registration: ${id}` });
    return { message: "Xóa đăng ký học thành công", registrations };
  }
}

module.exports = DeleteRegistrationUseCase;

