const Registration = require('../models/Registration');

class RegistrationRepository {
  async findAll() {
    return await Registration.find({});
  }

  async create(data) {
    const newRegistration = new Registration(data);
    return await newRegistration.save();
  }

  async update(id, data) {
    return await Registration.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await Registration.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await Registration.findOne(condition);
  }
  async getNextId() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'registration_id' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `registration${String(counter.value).padStart(3, '0')}`;
    } catch (error) {
      throw new Error('Lỗi khi tạo mã đăng ký: ' + error.message);
    }
  }
}

module.exports = new RegistrationRepository();