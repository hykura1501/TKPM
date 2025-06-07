// Use case: Get program by id
class GetProgramByIdUseCase {
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute(id) {
    return await this.programRepository.findOneByCondition({ id });
  }
}

module.exports = GetProgramByIdUseCase;
