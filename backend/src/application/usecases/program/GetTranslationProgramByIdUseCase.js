// Use case: Get translation for a program by id
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class GetTranslationProgramByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute(programId) {
    if (!programId) {
      await addLogEntry({ message: "ID chương trình không được để trống", level: "warn" });
      throw { status: 400, message: "ID chương trình không được để trống" };
    }
    const program = await this.programRepository.findOneByCondition({ id: programId });
    if (!program) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    const translations = {};
    for (const locale of SUPPORTED_LOCALES) {
      translations[locale] = {
        programName: program.name.get(locale)
      };
    }
    return translations;
  }
}

module.exports = GetTranslationProgramByIdUseCase;
