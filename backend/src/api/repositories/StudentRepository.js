const Student = require("../models/Student");
const Program = require("../models/Program");
const Status = require("../models/Status");
const Counter = require("../models/Counter");
const Setting = require("../models/Setting");

class StudentRepository {
  async getAllStudents() {
    try {
      return await Student.find({}, { _id: 0 });
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách sinh viên từ DB: " + error.message);
    }
  }

  async createStudent(studentData) {
    try {
      return await Student.create(studentData);
    } catch (error) {
      throw new Error("Lỗi khi tạo sinh viên: " + error.message);
    }
  }

  async createManyStudents(studentsData) {
    try {
      return await Student.insertMany(studentsData);
    } catch (error) {
      throw new Error("Lỗi khi tạo nhiều sinh viên: " + error.message);
    }
  }

  async updateStudent(mssv, studentData) {
    try {
      return await Student.updateOne({ mssv }, { $set: studentData });
    } catch (error) {
      throw new Error("Lỗi khi cập nhật sinh viên: " + error.message);
    }
  }

  async deleteStudent(mssv) {
    try {
      return await Student.deleteOne({ mssv });
    } catch (error) {
      throw new Error("Lỗi khi xóa sinh viên: " + error.message);
    }
  }

  async findStudentByMssv(mssv) {
    try {
      return await Student.findOne({ mssv });
    } catch (error) {
      throw new Error("Lỗi khi tìm sinh viên: " + error.message);
    }
  }

  async getNextMssv() {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "student_mssv" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      return `SV${String(counter.value).padStart(3, "0")}`;
    } catch (error) {
      throw new Error("Lỗi khi tạo MSSV: " + error.message);
    }
  }
}

module.exports = new StudentRepository();