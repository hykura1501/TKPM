const ClassSection = require("../models/ClassSection");
const Counter = require("../models/Counter");

class ClassSectionRepository {
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
      // dạng mã  như sau Section-2
      return `section-${counter.value}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo mã lớp: " + error.message);
    }
  }
}

module.exports = new ClassSectionRepository();
