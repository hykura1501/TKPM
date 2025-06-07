// SettingRepository implements ISettingRepository (Infrastructure Layer)
const SettingModel = require('../../api/models/Setting');
const ISettingRepository = require('../../domain/repositories/ISettingRepository');

const Setting = require('../../domain/entities/Setting');
class SettingRepository extends ISettingRepository {
  async findAll() {
    const docs = await SettingModel.find({});
    return docs.map(doc => new Setting(doc));
  }
  async update(id, data) {
    return await SettingModel.updateOne({ _id: id }, { $set: data });
  }
  async findOneByCondition(condition) {
    return await SettingModel.findOne(condition);
  }
}
module.exports = SettingRepository;
