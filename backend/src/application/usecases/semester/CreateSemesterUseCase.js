// Use case: Create a new semester
class CreateSemesterUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISemesterRepository')} params.semesterRepository - Repository thao tác học kỳ
   */
  constructor({ semesterRepository }) {
    /** @type {import('@domain/repositories/ISemesterRepository')} */
    this.semesterRepository = semesterRepository;
  }

  async execute(semesterData) {
    return await this.semesterRepository.create(semesterData);
  }
}

module.exports = CreateSemesterUseCase;
