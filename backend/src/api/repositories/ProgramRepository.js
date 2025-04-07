const Program = require('../models/Program');

class ProgramRepository {
  async findAll() {
    return await Program.find({});
  }

  async create(data) {
    const newProgram = new Program(data);
    return await newProgram.save();
  }

  async update(id, data) {
    return await Program.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await Program.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await Program.findOne(condition);
  }
}

module.exports = new ProgramRepository();