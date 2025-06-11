// ClassSectionRepository implements IClassSectionRepository (Infrastructure Layer)
const ClassSection = require("@domain/entities/ClassSection");
const Counter = require("@domain/entities/Counter"); 

const IClassSectionRepository = require("@domain/repositories/IClassSectionRepository");

class ClassSectionRepository extends IClassSectionRepository {
  async findAll() {
    return await ClassSection.find({});
  }

  async findAllByCondition(condition) { 
    return await ClassSection.find(condition);
  }

  async create(data) {
    const newClassSection = new ClassSection(data);
    return await newClassSection.save();
  }

  async update(id, data) {
    return await ClassSection.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await ClassSection.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await ClassSection.findOne(condition);
  }
  async getNextId() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "Section" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `section-${counter.value}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo mã lớp: " + error.message);
    }
  }
}

module.exports = ClassSectionRepository;
