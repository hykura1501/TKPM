// Use case: Delete a setting
class DeleteSettingUseCase {
  constructor({ settingRepository }) {
    this.settingRepository = settingRepository;
  }

  async execute(id) {
    return await this.settingRepository.delete(id);
  }
}

module.exports = DeleteSettingUseCase;
