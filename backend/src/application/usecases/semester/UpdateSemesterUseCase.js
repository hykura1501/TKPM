// Use case: Update a semester
class UpdateSemesterUseCase {
  constructor({ semesterRepository }) {
    this.semesterRepository = semesterRepository;
  }

  async execute(id, semesterData) {
    return await this.semesterRepository.update(id, semesterData);
  }
}

module.exports = UpdateSemesterUseCase;
