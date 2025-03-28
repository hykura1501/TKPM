const Setting = require("../models/Setting");
const { addLogEntry } = require("../helpers/logging");
const Status = require("../models/Status");
const generateStatusTransitionRules = require("../helpers/statusRule");
class SettingController {
  async updateDomains(req, res) {
    try {
      const domains = req.body.domains;

      if (!domains?.length) {
        await addLogEntry({
          message: "Danh sách domain không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "Danh sách domain không được để trống" });
      }

      // Cập nhật chỉ một bản ghi
      await Setting.updateOne(
        {
          _id: "67e69a34c85ca96947abaae3",
        }, {
        allowDomains: domains,
      }
      );
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

  async updatePhoneFormats(req, res) {
    try {
      const phoneFormats = JSON.parse(req.body.phoneFormats);
      if (!phoneFormats?.length) {
        await addLogEntry({
          message: "Danh sách phone formats không được để trống",
          level: "warn",
        });
        return res.status(400).json({ error: "Danh sách phone formats không được để trống" });
      }

      console.log(phoneFormats);

      await Setting.updateOne(
        {
          _id: "67e69a34c85ca96947abaae3",
        }, {
        $set: {
          allowPhones: phoneFormats
        }
      });
      res.status(200).json({ message: "Cập nhật phone formats thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật phone formats:", error);
      await addLogEntry({
        message: "Lỗi khi cập nhật phone formats",
        level: "error",
      });
      res.status(500).json({ error: "Lỗi khi cập nhật phone formats" });
    }
  }

  async getAllSettings(req, res) {
    try {
      const setting = await Setting.find({});

      const status = await Status.find({})

      const _status = status.map((item) => {
        return {
          fromStatus: item.id,
          toStatus: item.allowedStatus
        }
      })

      const result = {
        statusTransitionRules: _status, allowedEmailDomains: setting[0].allowDomains, phoneFormats: setting[0].allowPhones
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
  async getStatusRules(req, res) {
    try {
      const status = await Status.find({})
      
      return res.status(200).json(generateStatusTransitionRules(status));
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