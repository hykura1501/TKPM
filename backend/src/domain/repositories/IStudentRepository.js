// Interface for Student Repository (Domain Layer)

class IStudentRepository {
  async getAllStudents() { throw new Error('Not implemented'); }
  async createStudent(studentData) { throw new Error('Not implemented'); }
  async createManyStudents(studentsData) { throw new Error('Not implemented'); }
  async updateStudent(mssv, studentData) { throw new Error('Not implemented'); }
  async deleteStudent(mssv) { throw new Error('Not implemented'); }
  async findStudentByMssv(mssv) { throw new Error('Not implemented'); }
  async getNextMssv() { throw new Error('Not implemented'); }
  async findOneByCondition(condition) { throw new Error('Not implemented'); }
}

module.exports = IStudentRepository;
