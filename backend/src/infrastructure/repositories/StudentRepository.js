// StudentRepository implements IStudentRepository (Infrastructure Layer)
const IStudentRepository = require('@domain/repositories/IStudentRepository');

const Student = require('@domain/entities/Student');
const Counter = require('@domain/entities/Counter');

class StudentRepository extends IStudentRepository {
  async getAllStudents() {
    const docs = await Student.find({}, { _id: 0 });
    return docs.map(doc => new Student(doc));
  }

  async createStudent(studentData) {
    return await Student.create(studentData);
  }

  async createManyStudents(studentsData) {
    return await Student.insertMany(studentsData);
  }

  async updateStudent(mssv, studentData) {
    return await Student.updateOne({ mssv }, { $set: studentData });
  }

  async deleteStudent(mssv) {
    return await Student.deleteOne({ mssv });
  }

  async findStudentByMssv(mssv) {
    return await Student.findOne({ mssv });
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
    return await Student.findOne(condition);
  }
}

module.exports = StudentRepository;
