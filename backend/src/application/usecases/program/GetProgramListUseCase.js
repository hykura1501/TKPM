const mapper = require('@shared/utils/mapper');

// Use case: Get list of programs
class GetProgramListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
  }

  async execute(language = 'vi') {
    const programs = await this.programRepository.findAll();
    return programs.map((program) => mapper.formatProgram(program, language));
  }
}

module.exports = GetProgramListUseCase;
