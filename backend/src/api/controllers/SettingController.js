const Setting = require("../models/Setting");
const { addLogEntry } = require("../helpers/logging");
const Status = require("../models/Status");
class SettingController {
  async updateDomains(req, res) {
    try {
      const domains = req.body.domains;
      console.log(domains);
      
      if (!domains?.length) {
        await addLogEntry({
          message: "Danh sách domain không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "Danh sách domain không được để trống" });
      }
      await Setting.create({allowDomains: domains});
      res.status(200).json({ message: "Cập nhật domain thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật domain:", error);
      await addLogEntry({
        message: "Lỗi khi cập nhật domain",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi cập nhật domain" });
    }
  }
  async getDomains(req, res) {
    try {
      const setting = await Setting.findOne({ key: "allowDomains" });
      res.status.json({ domains: setting.value });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách domain:", error);
      await addLogEntry({
        message: "Lỗi khi lấy danh sách domain",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi lấy danh sách domain" });
    }
  }


  async getAllSettings(req, res) {
    try {
      const setting = await Setting.find({ });

      const status = await Status.find({})

      const _status = status.map((item) => {
        return {
          fromStatus: item.id,
          toStatus: item.allowedStatus
        }
      })

      const result = {
        phoneFormats: [
          {
            countryCode: "VN",
            countryName: "Việt Nam",
            pattern: "^(0|\\+84)[3|5|7|8|9][0-9]{8}$",
            example: "0901234567 hoặc +84901234567",
            prefix: "+84",
          },
          {
            countryCode: "US",
            countryName: "Hoa Kỳ",
            pattern: "^(\\+1)?[0-9]{10}$",
            example: "1234567890 hoặc +11234567890",
            prefix: "+1",
          },
          {
            countryCode: "JP",
            countryName: "Nhật Bản",
            pattern: "^(\\+81|0)[0-9]{9,10}$",
            example: "0123456789 hoặc +81123456789",
            prefix: "+81",
          },
          {
            countryCode: "FR",
            countryName: "Pháp",
            pattern: "^(\\+33|0)[1-9][0-9]{8}$",
            example: "0123456789 hoặc +33123456789",
            prefix: "+33",
          },
        ], statusTransitionRules: _status, allowedEmailDomains: setting[0].allowDomains
      }
      
      return res.status(200).json(result);

    } catch (error) {
      console.error("Lỗi khi lấy danh sách setting:", error);
      await addLogEntry({
        message: "Lỗi khi lấy danh sách setting",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi lấy danh sách setting" });
    }
  }
}

module.exports = new SettingController();