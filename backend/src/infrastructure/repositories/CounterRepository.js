// CounterRepository implements ICounterRepository (Infrastructure Layer)
const Counter = require('@domain/entities/Counter');
const ICounterRepository = require('@domain/repositories/ICounterRepository');

class CounterRepository extends ICounterRepository {
  async findOneByName(name) {
    return await Counter.findOne({ name });
  }
  async updateValue(name, value) {
    return await Counter.updateOne({ name }, { $set: { value } });
  }
  async increment(name) {
    return await Counter.findOneAndUpdate(
      { name },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
  }
}
module.exports = CounterRepository;
