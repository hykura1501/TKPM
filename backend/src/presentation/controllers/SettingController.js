// SettingController (Presentation Layer)
class SettingController {
  constructor({
    getSettingListUseCase,
    getDomainsUseCase,
    updatePhoneFormatsUseCase,
    getStatusRulesUseCase,
    getAllSettingsUseCase
  }) {
    this.getSettingListUseCase = getSettingListUseCase;
    this.getDomainsUseCase = getDomainsUseCase;
    this.updatePhoneFormatsUseCase = updatePhoneFormatsUseCase;
    this.getStatusRulesUseCase = getStatusRulesUseCase;
    this.getAllSettingsUseCase = getAllSettingsUseCase;
  }
  async getListSettings(req, res) {
    try {
      const settings = await this.getSettingListUseCase.execute();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDomains(req, res) {
    try {
      const result = await this.getDomainsUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách domain:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách domain" });
    }
  }

  async updatePhoneFormats(req, res) {
    try {
      const result = await this.updatePhoneFormatsUseCase.execute(req.body.phoneFormats);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật phone formats:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật phone formats" });
    }
  }

  async getStatusRules(req, res) {
    try {
      const rules = await this.getStatusRulesUseCase.execute(req.language);
      res.status(200).json(rules);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách setting:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách setting" });
    }
  }
  
  async getAllSettings(req, res) {
    try {
      const settings = await this.getAllSettingsUseCase.execute();
      res.status(200).json(settings);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả cài đặt:", error);
      res.status(500).json({ error: "Lỗi khi lấy tất cả cài đặt" });
    }
  }

  async updateDomains(req, res) {
    try {
      const result = await this.getDomainsUseCase.execute(req.body.domains);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật domains:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật domains" });
    }
  }
}

module.exports = SettingController;
