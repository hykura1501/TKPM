// Use case: Get grades by student id
const { addLogEntry } = require('@shared/utils/logging');

class GetGradeByStudentIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   */
  constructor({ registrationRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
  }

  async execute(studentId) {
    if (!studentId) {
      await addLogEntry({ message: "ID sinh viên không được để trống", level: "warn" });
      throw { status: 400, message: "ID sinh viên không được để trống" };
    }
    const grades = await this.registrationRepository.findAllByCondition({ studentId });
    if (!grades) {
      await addLogEntry({ message: "Không tìm thấy đăng ký học nào cho sinh viên này", level: "warn" });
      throw { status: 404, message: "Không tìm thấy đăng ký học nào cho sinh viên này" };
    }
    return grades;
  }
}

module.exports = GetGradeByStudentIdUseCase;
