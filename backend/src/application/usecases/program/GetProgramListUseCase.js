// Use case: Get list of programs
class GetProgramListUseCase {
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute() {
    return await this.programRepository.findAll();
  }
}

module.exports = GetProgramListUseCase;
