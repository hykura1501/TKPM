// Use case: Get grades by student id
const { addLogEntry } = require("@shared/utils/logging");

class GetGradeByStudentIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@usecases/course/GetCourseByIdUseCase')} params.getCourseByIdUseCase - Use case lấy thông tin khóa học
   */
  constructor({ registrationRepository, classSectionRepository, studentRepository, getCourseByIdUseCase }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
    /** @type {import('@usecases/course/GetCourseByIdUseCase')} */
    this.getCourseByIdUseCase = getCourseByIdUseCase;
  }

  async getGradeByStudentId(studentId) {
    if (!studentId) {
      await addLogEntry({
        message: "ID sinh viên không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID sinh viên không được để trống" };
    }

    const grades = await this.registrationRepository.findAllByCondition({
      studentId,
    });
    if (!grades) {
      await addLogEntry({
        message: "Không tìm thấy đăng ký học nào cho sinh viên này",
        level: "warn",
      });
      throw {
        status: 404,
        message: "Không tìm thấy đăng ký học nào cho sinh viên này",
      };
    }

    return grades;
  }
  async execute(studentId, language = "vi") {
    const grades = (
      await this.getGradeByStudentId(studentId)
    )
      .filter((grade) => grade.grade !== null && grade.grade !== undefined)
      .map((grade) => grade.toJSON());
    

    let gpa = 0;
    let totalCredits = 0;

    for (let i = 0; i < grades.length; i++) {
      const classInfo = await this.classSectionRepository.findOneByCondition(
        {id: grades[i].classSectionId}
      );
      if (classInfo) {
        grades[i].classInfo = classInfo.toJSON();
        const courseInfo = await this.getCourseByIdUseCase.execute(
          classInfo.courseId,
          language
        );
        if (courseInfo) {
          grades[i].classInfo.courseInfo = courseInfo;
        }
      }
      if (grades[i].grade) {
        gpa += grades[i].grade * grades[i].classInfo.courseInfo.credits;
        totalCredits += grades[i].classInfo.courseInfo.credits;
      }
    }

    const studentInfo = await this.studentRepository.findOneByCondition(
      {mssv: studentId}
    );

    return ({
      grades,
      studentInfo,
      gpa: gpa / totalCredits,
      totalCredits,
      totalCourses: grades.length,
    });
  }
}

module.exports = GetGradeByStudentIdUseCase;
