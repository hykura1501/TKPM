// CourseRepository implements ICourseRepository (Infrastructure Layer)
const Counter = require("@domain/entities/Counter");
const Course = require("@domain/entities/Course");
const ICourseRepository = require("@domain/repositories/ICourseRepository");

class CourseRepository extends ICourseRepository {
  async findAll() {
    return await Course.find({});
  }

  async create(data) {
    const newCourse = new Course(data);
    return await newCourse.save();
  }

  async update(id, data) {
    return await Course.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await Course.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await Course.findOne(condition);
  }
  async getNextId() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "classSection_id" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `course-${counter.value}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo mã khóa học: " + error.message);
    }
  }
}

module.exports = CourseRepository;
