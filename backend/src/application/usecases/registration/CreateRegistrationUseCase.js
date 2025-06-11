// Use case: Create a new registration
const { registrationSchema } = require('@validators/registrationValidator');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class CreateRegistrationUseCase {
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

  async execute(registrationData) {
    // Validate schema
    const parsed = registrationSchema.safeParse(registrationData);
    if (!parsed.success) {
      await addLogEntry({ message: 'Đăng ký học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
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
    // Kiểm tra sĩ số
    if (existingClassSection.currentEnrollment >= existingClassSection.maxCapacity) {
      await addLogEntry({ message: 'Lớp học đã đủ sĩ số', level: 'warn' });
      throw { status: 400, message: 'Lớp học đã đủ sĩ số' };
    }
    // Kiểm tra trùng đăng ký
    const existingRegistration = await this.registrationRepository.findOneByCondition({
      studentId: parsed.data.studentId,
      classSectionId: parsed.data.classSectionId,
    });
    if (existingRegistration) {
      await addLogEntry({ message: 'Sinh viên đã đăng ký lớp học này', level: 'warn' });
      throw { status: 400, message: 'Sinh viên đã đăng ký lớp học này' };
    }
    // Tạo đăng ký mới
    const newRegistration = {
      ...parsed.data,
      id: Date.now().toString(),
    };
    await this.registrationRepository.create(newRegistration);
    // Tăng sĩ số lớp
    existingClassSection.currentEnrollment += 1;
    await this.classSectionRepository.update(existingClassSection.id, existingClassSection);
    await addLogEntry({ message: 'Thêm đăng ký học thành công', level: 'info', action: 'create', entity: 'registration', user: 'admin', details: `Add new registration: ${parsed.data.studentId}` });
    const registrations = await this.registrationRepository.findAll();
    return { message: "Thêm đăng ký học thành công", registrations };
  }
}

module.exports = CreateRegistrationUseCase;

