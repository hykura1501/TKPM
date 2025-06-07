// Use case: Delete a registration
const { SUPPORTED_LOCALES } = require('@configs/locales');

class DeleteRegistrationUseCase {
  constructor({ registrationRepository, studentRepository }) {
    this.registrationRepository = registrationRepository;
    this.studentRepository = studentRepository;
  }

  async execute(id) {
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
    await addLogEntry({ message: 'Xóa đăng ký học thành công', level: 'info', action: 'delete', entity: 'registration', user: 'admin', details: `Deleted registration: ${id}` });
    return { success: true };
  }
}

module.exports = DeleteRegistrationUseCase;

