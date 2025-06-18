// Use case: Import students from XML or JSON file
const fs = require('fs');
const xml2js = require('xml2js');
const { addLogEntry } = require('@shared/utils/logging');

class ImportStudentsFromFileUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ studentRepository, settingRepository, facultyRepository, programRepository, statusRepository }) {
    this.studentRepository = studentRepository;
    this.settingRepository = settingRepository;
    this.facultyRepository = facultyRepository;
    this.programRepository = programRepository;
    this.statusRepository = statusRepository;
  }

  async parseFile(filePath, fileType) {
    if (fileType === 'json') {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } else if (fileType === 'xml') {
      const data = fs.readFileSync(filePath, 'utf-8');
      const result = await xml2js.parseStringPromise(data, { explicitArray: false });
      // Giả sử XML có dạng <students><student>...</student></students>
      return Array.isArray(result.students.student)
        ? result.students.student
        : [result.students.student];
    } else {
      throw new Error('Unsupported file type');
    }
  }

  async execute({ filePath, fileType }) {
    const studentsData = await this.parseFile(filePath, fileType);
    // Tái sử dụng logic validate & insert của AddStudentsFromFileUseCase
    const AddStudentsFromFileUseCase = require('./AddStudentsFromFileUseCase');
    const addStudentsUseCase = new AddStudentsFromFileUseCase({
      studentRepository: this.studentRepository,
      settingRepository: this.settingRepository,
      facultyRepository: this.facultyRepository,
      programRepository: this.programRepository,
      statusRepository: this.statusRepository,
    });
    const imported = await addStudentsUseCase.execute(studentsData);
    await addLogEntry({ message: `Import sinh viên từ file ${fileType}`, level: 'info', action: 'import', entity: 'student', user: 'admin' });
    return imported;
  }
}

module.exports = ImportStudentsFromFileUseCase;
