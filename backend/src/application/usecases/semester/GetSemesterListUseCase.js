// Use case: Get list of semesters
class GetSemesterListUseCase {
  constructor({ semesterRepository }) {
    this.semesterRepository = semesterRepository;
  }

  async execute() {
    return await this.semesterRepository.findAll();
  }
}

module.exports = GetSemesterListUseCase;
