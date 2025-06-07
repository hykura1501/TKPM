// Use case: Get list of settings
class GetSettingListUseCase {
  constructor({ settingRepository }) {
    this.settingRepository = settingRepository;
  }

  async execute() {
    return await this.settingRepository.findAll();
  }
}

module.exports = GetSettingListUseCase;
