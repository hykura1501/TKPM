// SemesterRepository implements ISemesterRepository (Infrastructure Layer)
const SemesterModel = require('../../api/models/Semester');
const ISemesterRepository = require('../../domain/repositories/ISemesterRepository');

const Semester = require('../../domain/entities/Semester');
class SemesterRepository extends ISemesterRepository {
  async findAll() {
    const docs = await SemesterModel.find({});
    return docs.map(doc => new Semester(doc));
  }
  async create(data) {
    const newSemester = new SemesterModel(data);
    return await newSemester.save();
  }
  async update(id, data) {
    return await SemesterModel.updateOne({ id }, { $set: data });
  }
  async delete(id) {
    return await SemesterModel.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await SemesterModel.findOne(condition);
  }
}
module.exports = SemesterRepository;
