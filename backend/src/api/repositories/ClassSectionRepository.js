const ClassSection = require("../models/ClassSection");
const Counter = require("../models/Counter");

class ClassSectionRepository {
  async findAll() {
    return await ClassSection.find({});
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
        { name: "classSection_id" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `classSection${String(counter.value).padStart(3, "0")}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo mã lớp: " + error.message);
    }
  }
}

module.exports = new ClassSectionRepository();
