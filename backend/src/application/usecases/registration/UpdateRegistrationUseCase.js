// Use case: Update a registration
const { registrationSchema } = require('@validators/registrationValidator');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateRegistrationUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ registrationRepository, studentRepository, classSectionRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id, registrationData, language = 'vi') {
    // Validate schema
    const parsed = registrationSchema.safeParse({ ...registrationData, id });
    if (!parsed.success) {
      await addLogEntry({ message: 'Cập nhật đăng ký học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại đăng ký
    const existingRegistration = await this.registrationRepository.findOneByCondition({ id });
    if (!existingRegistration) {
      await addLogEntry({ message: 'Đăng ký học không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Đăng ký học không tồn tại' };
    }
    // Kiểm tra tồn tại sinh viên
    const existingStudent = await this.studentRepository.findStudentByMssv(parsed.data.studentId);
    if (!existingStudent) {
      await addLogEntry({ message: 'Sinh viên không tồn tại', level: 'warn' });
      throw { status: 400, message: 'Sinh viên không tồn tại' };
    }
    // Kiểm tra tồn tại lớp học
    const existingClassSection = await this.classSectionRepository.findOneByCondition({ id: parsed.data.classSectionId });
    if (!existingClassSection) {
      await addLogEntry({ message: 'Lớp học không tồn tại', level: 'warn' });
      throw { status: 400, message: 'Lớp học không tồn tại' };
    }
    // Cập nhật đăng ký
    await this.registrationRepository.update(id, parsed.data);
    const registrations = await this.registrationRepository.findAll();
    await addLogEntry({ message: 'Cập nhật đăng ký học thành công', level: 'info', action: 'update', entity: 'registration', user: 'admin', details: `Updated registration: ${id}` });
    return { message: "Cập nhật đăng ký học thành công", registrations };
  }
}

module.exports = UpdateRegistrationUseCase;

