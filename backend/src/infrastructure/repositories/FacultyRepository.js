// FacultyRepository implements IFacultyRepository (Infrastructure Layer)
const FacultyModel = require('../../api/models/Faculty');
const IFacultyRepository = require('../../domain/repositories/IFacultyRepository');

const Faculty = require('../../domain/entities/Faculty');
class FacultyRepository extends IFacultyRepository {
  async findAll() {
    const docs = await FacultyModel.find({});
    return docs.map(doc => new Faculty(doc));
  }
  async create(data) {
    const newFaculty = new FacultyModel(data);
    return await newFaculty.save();
  }
  async update(id, data) {
    return await FacultyModel.updateOne({ id }, { $set: data });
  }
  async delete(id) {
    return await FacultyModel.deleteOne({ id });
  }
  async findOneByCondition(condition) {
    return await FacultyModel.findOne(condition);
  }
}
module.exports = FacultyRepository;
