// Interface for Student Repository (Domain Layer)

class IStudentRepository {
  /**
   * @returns {Promise<Array<any>>}
   */
  async getAllStudents() { throw new Error('Not implemented'); }
  /**
   * @param {any} studentData
   * @returns {Promise<any>}
   */
  async createStudent(studentData) { throw new Error('Not implemented'); }
  /**
   * @param {Array<any>} studentsData
   * @returns {Promise<any>}
   */
  async createManyStudents(studentsData) { throw new Error('Not implemented'); }
  /**
   * @param {string} mssv
   * @param {any} studentData
   * @returns {Promise<any>}
   */
  async updateStudent(mssv, studentData) { throw new Error('Not implemented'); }
  /**
   * @param {string} mssv
   * @returns {Promise<any>}
   */
  async deleteStudent(mssv) { throw new Error('Not implemented'); }
  /**
   * @param {string} mssv
   * @returns {Promise<any>}
   */
  async findStudentByMssv(mssv) { throw new Error('Not implemented'); }
  /**
   * @returns {Promise<string>}
   */
  async getNextMssv() { throw new Error('Not implemented'); }
  /**
   * @param {any} condition
   * @returns {Promise<any>}
   */
  async findOneByCondition(condition) { throw new Error('Not implemented'); }
}

module.exports = IStudentRepository;
