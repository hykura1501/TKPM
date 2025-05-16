const Counter = require('../models/Counter');
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
  async getNextId() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'status_id' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `status-${counter.value}`;
    } catch (error) {
      throw new Error('Lỗi khi tạo mã trạng thái: ' + error.message);
    }
  }
}

module.exports = new StatusRepository();