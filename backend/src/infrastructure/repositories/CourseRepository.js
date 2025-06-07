// CourseRepository implements ICourseRepository (Infrastructure Layer)
const CourseModel = require('../../api/models/Course');
const Counter = require('../../api/models/Counter');
const ICourseRepository = require('../../domain/repositories/ICourseRepository');

const Course = require('../../domain/entities/Course');
class CourseRepository extends ICourseRepository {
  async findAll() {
    const docs = await CourseModel.find({});
    return docs.map(doc => new Course(doc));
  }

  async create(data) {
    const newCourse = new CourseModel(data);
    return await newCourse.save();
  }

  async update(id, data) {
    return await CourseModel.updateOne({ id }, { $set: data });
  }

  async delete(id) {
    return await CourseModel.deleteOne({ id });
  }

  async findOneByCondition(condition) {
    return await CourseModel.findOne(condition);
  }

  async getNextId() {
    const counter = await Counter.findOneAndUpdate(
      { name: 'classSection_id' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    return `course-${counter.value}`;
  }
}

module.exports = CourseRepository;
