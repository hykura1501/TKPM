// Use case: Create a new setting
const { SUPPORTED_LOCALES } = require('@configs/locales');

class CreateSettingUseCase {
  constructor({ settingRepository }) {
    this.settingRepository = settingRepository;
  }

  async execute(settingData) {
    if (!settingData || Object.keys(settingData).length === 0) {
      await addLogEntry({ message: 'Dữ liệu cài đặt không được để trống', level: 'warn' });
      throw { status: 400, message: 'Dữ liệu cài đặt không được để trống' };
    }
    const created = await this.settingRepository.create(settingData);
    await addLogEntry({ message: 'Thêm cài đặt thành công', level: 'info', action: 'create', entity: 'setting', user: 'admin', details: `Add new setting` });
    return { success: true, setting: created };
  }
}

module.exports = CreateSettingUseCase;

