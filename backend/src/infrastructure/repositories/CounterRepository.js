// CounterRepository implements ICounterRepository (Infrastructure Layer)
const CounterModel = require('../../api/models/Counter');
const ICounterRepository = require('../../domain/repositories/ICounterRepository');

class CounterRepository extends ICounterRepository {
  async findOneByName(name) {
    return await CounterModel.findOne({ name });
  }
  async updateValue(name, value) {
    return await CounterModel.updateOne({ name }, { $set: { value } });
  }
  async increment(name) {
    return await CounterModel.findOneAndUpdate(
      { name },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
  }
}
module.exports = new CounterRepository();
