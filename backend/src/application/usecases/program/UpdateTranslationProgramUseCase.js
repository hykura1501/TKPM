// Use case: Update translation for a program by id
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class UpdateTranslationProgramUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute(programId, translations) {
    if (!programId) {
      await addLogEntry({ message: "ID chương trình không được để trống", level: "warn" });
      throw { status: 400, message: "ID chương trình không được để trống" };
    }
    const program = await this.programRepository.findOneByCondition({ id: programId });
    if (!program) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        program.name.set(locale, translations[locale].programName);
      }
    });
    await this.programRepository.update(programId, { name: program.name });
    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = UpdateTranslationProgramUseCase;
