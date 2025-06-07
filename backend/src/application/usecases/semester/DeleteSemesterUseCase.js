// Use case: Delete a semester
class DeleteSemesterUseCase {
  constructor({ semesterRepository }) {
    this.semesterRepository = semesterRepository;
  }

  async execute(id) {
    return await this.semesterRepository.delete(id);
  }
}

module.exports = DeleteSemesterUseCase;
