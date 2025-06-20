// Use case: Update translation for a status by id
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateTranslationStatusUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute(statusId, translations) {
    if (!statusId) {
      await addLogEntry({ 
        message: "ID tình trạng không được để trống", 
        level: "warn",
        action: 'update-translation',
        entity: 'status',
        user: 'admin',
        details: 'Empty statusId provided for translation update'
      });
      throw { status: 400, message: "ID tình trạng không được để trống" };
    }
    const status = await this.statusRepository.findOneByCondition({ id: statusId });
    if (!status) {
      await addLogEntry({ 
        message: "Tình trạng sinh viên không tồn tại", 
        level: "warn",
        action: 'update-translation',
        entity: 'status',
        user: 'admin',
        details: 'Status not found: ' + statusId
      });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        if (status.name?.set) {
          status.name.set(locale, translations[locale].statusName);
        } else {
          status.name[locale] = translations[locale].statusName;
        }
      }
    });
    await this.statusRepository.update(statusId, { name: status.name });
    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = UpdateTranslationStatusUseCase;
