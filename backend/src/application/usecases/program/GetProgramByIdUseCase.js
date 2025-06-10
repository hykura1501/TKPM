// Use case: Get program by id
class GetProgramByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
  }

  async execute(id) {
    return await this.programRepository.findOneByCondition({ id });
  }
}

module.exports = GetProgramByIdUseCase;
