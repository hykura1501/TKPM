// Use case: Get grades by class section id
const { addLogEntry } = require('@shared/utils/logging');

class GetGradeByClassIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   */
  constructor({ registrationRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
  }

  async execute(classId) {
    if (!classId) {
      await addLogEntry({ message: "ID lớp học không được để trống", level: "warn" });
      throw { status: 400, message: "ID lớp học không được để trống" };
    }
    const grades = await this.registrationRepository.findAllByCondition({ classSectionId: classId, status: { $ne: "cancelled" } });
    if (!grades) {
      await addLogEntry({ message: "Không tìm thấy đăng ký học nào cho lớp học này", level: "warn" });
      throw { status: 404, message: "Không tìm thấy đăng ký học nào cho lớp học này" };
    }
    return grades;
  }
}

module.exports = GetGradeByClassIdUseCase;
