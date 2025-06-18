const SettingRepository = require('../repositories/SettingRepository');
const StatusRepository = require('../repositories/StatusRepository');
const { addLogEntry } = require('../helpers/logging');
const generateStatusTransitionRules = require('../helpers/statusRule');

class SettingService {
  async updateDomains(domains) {
    if (!domains?.length) {
      await addLogEntry({ message: "Danh sách domain không được để trống", level: "warn" });
      throw { status: 400, message: "Danh sách domain không được để trống" };
    }

    await SettingRepository.update("67e69a34c85ca96947abaae3", { allowDomains: domains });
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

  async getDomains() {
    const setting = await SettingRepository.findOneByCondition({ _id: "67e69a34c85ca96947abaae3" });
    if (!setting) {
      throw new Error("Không tìm thấy cài đặt domain");
    }
    return { domains: setting.allowDomains };
  }

  async updatePhoneFormats(phoneFormats) {
    const parsedFormats = JSON.parse(phoneFormats);
    if (!parsedFormats?.length) {
      await addLogEntry({ message: "Danh sách phone formats không được để trống", level: "warn" });
      throw { status: 400, message: "Danh sách phone formats không được để trống" };
    }

    await SettingRepository.update("67e69a34c85ca96947abaae3", { allowPhones: parsedFormats });
    await addLogEntry({
      message: "Cập nhật phone formats thành công",
      level: "info",
      action: "update",
      entity: "setting",
      user: "admin",
      details: `Updated phone formats: ${parsedFormats.join(", ")}`,
    });
    return { message: "Cập nhật phone formats thành công" };
  }

  async getAllSettings() {
    const settings = await SettingRepository.findOneByCondition({ _id: "67e69a34c85ca96947abaae3" });
    if (!settings) {
      throw new Error("Không tìm thấy cài đặt");
    }
    const statuses = await StatusRepository.findAll();

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

  async getStatusRules() {
    const statuses = await StatusRepository.findAll();
    return generateStatusTransitionRules(statuses);
  }
}

module.exports = new SettingService();