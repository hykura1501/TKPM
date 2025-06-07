// StudentRepository implements IStudentRepository (Infrastructure Layer)
const StudentModel = require('../../api/models/Student');
const Counter = require('../../api/models/Counter');
const IStudentRepository = require('../../domain/repositories/IStudentRepository');

const Student = require('../../domain/entities/Student');
class StudentRepository extends IStudentRepository {
  async getAllStudents() {
    const docs = await StudentModel.find({}, { _id: 0 });
    return docs.map(doc => new Student(doc));
  }

  async createStudent(studentData) {
    return await StudentModel.create(studentData);
  }

  async createManyStudents(studentsData) {
    return await StudentModel.insertMany(studentsData);
  }

  async updateStudent(mssv, studentData) {
    return await StudentModel.updateOne({ mssv }, { $set: studentData });
  }

  async deleteStudent(mssv) {
    return await StudentModel.deleteOne({ mssv });
  }

  async findStudentByMssv(mssv) {
    return await StudentModel.findOne({ mssv });
  }

  async getNextMssv() {
    const counter = await Counter.findOneAndUpdate(
      { name: 'student_mssv' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    return `SV${String(counter.value).padStart(3, '0')}`;
  }

  async findOneByCondition(condition) {
    return await StudentModel.findOne(condition);
  }
}

module.exports = StudentRepository;
