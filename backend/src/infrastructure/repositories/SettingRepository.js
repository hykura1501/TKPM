// SettingRepository implements ISettingRepository (Infrastructure Layer)
const ISettingRepository = require("@domain/repositories/ISettingRepository");

const Setting = require("@domain/entities/Setting");

class SettingRepository extends ISettingRepository {
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
module.exports = SettingRepository;
