// Use case: Get all settings (domains, phone formats, status rules)
class GetAllSettingsUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ settingRepository, statusRepository }) {
    this.settingRepository = settingRepository;
    this.statusRepository = statusRepository;
  }

  async execute() {
    const settings = await this.settingRepository.findOneByCondition({ _id: "67e69a34c85ca96947abaae3" });
    if (!settings) {
      throw new Error("Không tìm thấy cài đặt");
    }
    const statuses = await this.statusRepository.findAll();
    const statusRules = statuses.map(item => ({
      fromStatus: item.id,
      toStatus: item.allowedStatus,
    }));
    return {
      statusTransitionRules: statusRules,
      allowedEmailDomains: settings.allowDomains,
      phoneFormats: settings.allowPhones,
    };
  }
}

module.exports = GetAllSettingsUseCase;
