// Use case: Get list of semesters
class GetSemesterListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISemesterRepository')} params.semesterRepository - Repository thao tác học kỳ
   */
  constructor({ semesterRepository }) {
    /** @type {import('@domain/repositories/ISemesterRepository')} */
    this.semesterRepository = semesterRepository;
  }

  async execute() {
    return await this.semesterRepository.findAll();
  }
}

module.exports = GetSemesterListUseCase;
