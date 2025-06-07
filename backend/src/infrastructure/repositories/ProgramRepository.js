// ProgramRepository implements IProgramRepository (Infrastructure Layer)
const ProgramModel = require('../../api/models/Program');
const IProgramRepository = require('../../domain/repositories/IProgramRepository');

const Program = require('../../domain/entities/Program');
class ProgramRepository extends IProgramRepository {
  async findAll() {
    const docs = await ProgramModel.find({});
    return docs.map(doc => new Program(doc));
  }
  async create(data) {
    const newProgram = new ProgramModel(data);
    return await newProgram.save();
  }
  async update(id, data) {
    return await ProgramModel.updateOne({ id }, { $set: data });
  }
  async delete(id) {
    return await ProgramModel.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await ProgramModel.findOne(condition);
  }
}
module.exports = ProgramRepository;
