// StatusRepository implements IStatusRepository (Infrastructure Layer)
const StatusModel = require('../../api/models/Status');
const IStatusRepository = require('../../domain/repositories/IStatusRepository');

const Status = require('../../domain/entities/Status');
class StatusRepository extends IStatusRepository {
  async findAll() {
    const docs = await StatusModel.find({});
    return docs.map(doc => new Status(doc));
  }
  async create(data) {
    const newStatus = new StatusModel(data);
    return await newStatus.save();
  }
  async update(id, data) {
    return await StatusModel.updateOne({ id }, { $set: data });
  }
  async delete(id) {
    return await StatusModel.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await StatusModel.findOne(condition);
  }
}
module.exports = StatusRepository;
