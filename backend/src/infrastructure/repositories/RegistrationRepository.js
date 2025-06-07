// RegistrationRepository implements IRegistrationRepository (Infrastructure Layer)
const RegistrationModel = require('../../api/models/Registration');
const IRegistrationRepository = require('../../domain/repositories/IRegistrationRepository');

const Registration = require('../../domain/entities/Registration');
class RegistrationRepository extends IRegistrationRepository {
  async findAll() {
    const docs = await RegistrationModel.find({});
    return docs.map(doc => new Registration(doc));
  }
  async create(data) {
    const newRegistration = new RegistrationModel(data);
    return await newRegistration.save();
  }
  async update(id, data) {
    return await RegistrationModel.updateOne({ id }, { $set: data });
  }
  async delete(id) {
    return await RegistrationModel.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await RegistrationModel.findOne(condition);
  }
}
module.exports = RegistrationRepository;
