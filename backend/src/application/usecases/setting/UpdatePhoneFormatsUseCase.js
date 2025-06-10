const { addLogEntry } = require('@shared/utils/logging');

// Use case: Get list of counters
class UpdatePhoneFormatsUseCase {
   /**
   * @param {object} params
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository - Repository thao tác cài đặt
   */
  constructor({ settingRepository }) {
    /** @type {import('@domain/repositories/ISettingRepository')} */
    this.settingRepository = settingRepository;
  }

  async execute(phoneFormats) {
    const parsedFormats = JSON.parse(phoneFormats);
    if (!parsedFormats?.length) {
      await addLogEntry({ message: "Danh sách phone formats không được để trống", level: "warn" });
      throw { status: 400, message: "Danh sách phone formats không được để trống" };
    }

    await this.settingRepository.update("67e69a34c85ca96947abaae3", { allowPhones: parsedFormats });
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
}

module.exports = UpdatePhoneFormatsUseCase;
