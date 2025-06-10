// FacultyRepository implements IFacultyRepository (Infrastructure Layer)
const IFacultyRepository = require('@domain/repositories/IFacultyRepository');
const Faculty = require('@domain/entities/Faculty');
const Counter = require('@domain/entities/Counter');

class FacultyRepository extends IFacultyRepository {
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
  async getNextId() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "Faculty_id" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `Faculty-${counter.value}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo mã khoa: " + error.message);
    }
  }
}
module.exports = FacultyRepository;
