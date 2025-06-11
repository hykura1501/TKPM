// Use case: Get student by mssv
class GetStudentByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ studentRepository }) {
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute(mssv) {
    return await this.studentRepository.findStudentByMssv(mssv);
  }
}

module.exports = GetStudentByIdUseCase;
