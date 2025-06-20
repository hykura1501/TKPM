// Use case: Cancel a registration
const { addLogEntry } = require('@shared/utils/logging');

class CancelRegistrationUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ registrationRepository, classSectionRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id) {
    if (!id) {
      await addLogEntry({ 
        message: "ID đăng ký học không được để trống", 
        level: "warn",
        action: 'cancel',
        entity: 'registration',
        user: 'admin',
        details: 'Empty id provided for cancel'
      });
      throw { status: 400, message: "ID đăng ký học không được để trống" };
    }
    const registration = await this.registrationRepository.findOneByCondition({ id });
    if (!registration) {
      await addLogEntry({ 
        message: "Đăng ký học không tồn tại", 
        level: "warn",
        action: 'cancel',
        entity: 'registration',
        user: 'admin',
        details: 'Registration not found: ' + id
      });
      throw { status: 404, message: "Đăng ký học không tồn tại" };
    }
    await this.registrationRepository.update(id, { status: "cancelled" });
    // Giảm sĩ số lớp
    const classSection = await this.classSectionRepository.findOneByCondition({ id: registration.classSectionId });
    if (classSection) {
      classSection.currentEnrollment -= 1;
      await this.classSectionRepository.update(classSection.id, classSection);
    } else {
      await addLogEntry({ 
        message: "Lớp học không tồn tại", 
        level: "warn",
        action: 'cancel',
        entity: 'registration',
        user: 'admin',
        details: 'ClassSection not found: ' + registration.classSectionId
      });
      throw { status: 404, message: "Lớp học không tồn tại" };
    }
    const registrations = await this.registrationRepository.findAll();
    await addLogEntry({ message: "Hủy đăng ký học thành công", level: "info", action: "update", entity: "registration", user: "admin", details: `Cancelled registration: ${id}` });
    return { message: "Hủy đăng ký học thành công", registrations };
  }
}

module.exports = CancelRegistrationUseCase;
