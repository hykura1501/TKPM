// Use case: Update a setting
class UpdateSettingUseCase {
  constructor({ settingRepository }) {
    this.settingRepository = settingRepository;
  }

  async execute(id, settingData) {
    return await this.settingRepository.update(id, settingData);
  }
}

module.exports = UpdateSettingUseCase;
