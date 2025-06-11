// Use case: Get translation for a status by id
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class GetTranslationStatusByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute(statusId) {
    if (!statusId) {
      await addLogEntry({ message: "ID tình trạng không được để trống", level: "warn" });
      throw { status: 400, message: "ID tình trạng không được để trống" };
    }
    const status = await this.statusRepository.findOneByCondition({ id: statusId });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }
    const translations = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      translations[locale] = {
        statusName: status.name?.get?.(locale) || (status.name?.[locale] ?? null),
      };
    });
    return translations;
  }
}

module.exports = GetTranslationStatusByIdUseCase;
