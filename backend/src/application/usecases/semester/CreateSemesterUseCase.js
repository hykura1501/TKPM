// Use case: Create a new semester
class CreateSemesterUseCase {
  constructor({ semesterRepository }) {
    this.semesterRepository = semesterRepository;
  }

  async execute(semesterData) {
    return await this.semesterRepository.create(semesterData);
  }
}

module.exports = CreateSemesterUseCase;
