// Use case: Get list of settings
class GetDomainsUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository - Repository thao tác cài đặt
   */
  constructor({ settingRepository }) {
    /** @type {import('@domain/repositories/ISettingRepository')} */
    this.settingRepository = settingRepository;
  }

  async execute() {
    const setting = await this.settingRepository.findOneByCondition({ _id: "67e69a34c85ca96947abaae3" });
    if (!setting) {
      throw new Error("Không tìm thấy cài đặt domain");
    }
    return { domains: setting.allowDomains };
  }
}

module.exports = GetDomainsUseCase;
