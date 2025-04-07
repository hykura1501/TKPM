const Faculty = require('../models/Faculty');

class FacultyRepository {
  async findAll() {
    return await Faculty.find({});
  }

  async create(data) {
    const newFaculty = new Faculty(data);
    return await newFaculty.save();
  }

  async update(id, data) {
    return await Faculty.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await Faculty.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await Faculty.findOne(condition);
  }
}

module.exports = new FacultyRepository();