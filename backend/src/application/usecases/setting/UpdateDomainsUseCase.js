const { addLogEntry } = require('@shared/utils/logging');

// Use case: Update a setting
class UpdateDomainsUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository - Repository thao tác cài đặt
   */
  constructor({ settingRepository }) {
    /** @type {import('@domain/repositories/ISettingRepository')} */
    this.settingRepository = settingRepository;
  }

  async execute(domains) {
    if (!domains?.length) {
      await addLogEntry({ 
        message: "Danh sách domain không được để trống", 
        level: "warn",
        action: 'update',
        entity: 'setting',
        user: 'admin',
        details: 'Empty domains list provided for update'
      });
      throw { status: 400, message: "Danh sách domain không được để trống" };
    }

    await this.settingRepository.update("67e69a34c85ca96947abaae3", { allowDomains: domains });
    await addLogEntry({
      message: "Cập nhật domain thành công",
      level: "info",
      action: "update",
      entity: "setting",
      user: "admin",
      details: `Updated domains: ${domains.join(", ")}`,
    });
    return { message: "Cập nhật domain thành công" };
  }
}

module.exports = UpdateDomainsUseCase;
