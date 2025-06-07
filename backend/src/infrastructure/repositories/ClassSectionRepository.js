// ClassSectionRepository implements IClassSectionRepository (Infrastructure Layer)
const ClassSectionModel = require('../../api/models/ClassSection');
const IClassSectionRepository = require('../../domain/repositories/IClassSectionRepository');

const ClassSection = require('../../domain/entities/ClassSection');
class ClassSectionRepository extends IClassSectionRepository {
  async findAll() {
    const docs = await ClassSectionModel.find({});
    return docs.map(doc => new ClassSection(doc));
  }

  async create(data) {
    const newSection = new ClassSectionModel(data);
    return await newSection.save();
  }

  async update(id, data) {
    return await ClassSectionModel.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await ClassSectionModel.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await ClassSectionModel.findOne(condition);
  }
}

module.exports = ClassSectionRepository;
