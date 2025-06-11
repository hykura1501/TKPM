// Use case: Update a semester
class UpdateSemesterUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISemesterRepository')} params.semesterRepository - Repository thao tác học kỳ
   */
  constructor({ semesterRepository }) {
    /** @type {import('@domain/repositories/ISemesterRepository')} */
    this.semesterRepository = semesterRepository;
  }

  async execute(id, semesterData) {
    return await this.semesterRepository.update(id, semesterData);
  }
}

module.exports = UpdateSemesterUseCase;
