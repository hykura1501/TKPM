// Use case: Get list of students
class GetStudentListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ studentRepository }) {
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute() {
    return await this.studentRepository.getAllStudents();
  }
}

module.exports = GetStudentListUseCase;
