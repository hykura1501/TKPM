const Setting = require('../models/Setting');

class SettingRepository {
  async findAll() {
    return await Setting.find({});
  }

  async update(id, data) {
    return await Setting.updateOne({ _id: id }, { $set: data });
  }

  async findOneByCondition(condition) {
    return await Setting.findOne(condition);
  }
}

module.exports = new SettingRepository();