const Status = require('../models/Status');

class StatusRepository {
  async findAll() {
    return await Status.find({});
  }

  async create(data) {
    const newStatus = new Status(data);
    return await newStatus.save();
  }

  async update(id, data) {
    return await Status.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await Status.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await Status.findOne(condition);
  }
}

module.exports = new StatusRepository();