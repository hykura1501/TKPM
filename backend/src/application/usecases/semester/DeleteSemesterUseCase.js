// Use case: Delete a semester
class DeleteSemesterUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISemesterRepository')} params.semesterRepository - Repository thao tác học kỳ
   */
  constructor({ semesterRepository }) {
    /** @type {import('@domain/repositories/ISemesterRepository')} */
    this.semesterRepository = semesterRepository;
  }

  async execute(id) {
    return await this.semesterRepository.delete(id);
  }
}

module.exports = DeleteSemesterUseCase;
