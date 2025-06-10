// Use case: Save grades by class section id
const { addLogEntry } = require('@shared/utils/logging');

class SaveGradeByClassIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   */
  constructor({ registrationRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
  }

  async execute(classId, data) {
    if (!classId) {
      await addLogEntry({ message: "ID lớp học không được để trống", level: "warn" });
      throw { status: 400, message: "ID lớp học không được để trống" };
    }
    const grades = await this.registrationRepository.findAllByCondition({ classSectionId: classId });
    if (!grades) {
      await addLogEntry({ message: "Không tìm thấy đăng ký học nào cho lớp học này", level: "warn" });
      throw { status: 404, message: "Không tìm thấy đăng ký học nào cho lớp học này" };
    }
    for (const grade of grades) {
      const score = data[grade.studentId];
      await this.registrationRepository.updateGrade(grade.studentId, classId, score);
    }
    return { message: "Cập nhật điểm thành công", grades };
  }
}

module.exports = SaveGradeByClassIdUseCase;
