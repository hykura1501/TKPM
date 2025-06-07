// SettingController (Presentation Layer)
class SettingController {
  constructor({
    getSettingListUseCase,
    createSettingUseCase,
    updateSettingUseCase,
    deleteSettingUseCase
  }) {
    this.getSettingListUseCase = getSettingListUseCase;
    this.createSettingUseCase = createSettingUseCase;
    this.updateSettingUseCase = updateSettingUseCase;
    this.deleteSettingUseCase = deleteSettingUseCase;
  }
  async getListSettings(req, res) {
    try {
      const settings = await this.getSettingListUseCase.execute();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSetting(req, res) {
    try {
      const newSetting = await this.createSettingUseCase.execute(req.body);
      res.status(201).json(newSetting);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateSetting(req, res) {
    try {
      const updated = await this.updateSettingUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSetting(req, res) {
    try {
      const deleted = await this.deleteSettingUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SettingController;
