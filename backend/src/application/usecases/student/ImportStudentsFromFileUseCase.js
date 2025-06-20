// Use case: Import students from XML or JSON file
const xml2js = require("xml2js");
const { addLogEntry } = require("@shared/utils/logging");

class ImportStudentsFromFileUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   * @param {import('@usecases/student/CreateStudentUseCase')} params.createStudentUseCase
   */
  constructor({
    studentRepository,
    settingRepository,
    facultyRepository,
    programRepository,
    statusRepository,
    createStudentUseCase,
  }) {
    this.studentRepository = studentRepository;
    this.settingRepository = settingRepository;
    this.facultyRepository = facultyRepository;
    this.programRepository = programRepository;
    this.statusRepository = statusRepository;
    this.createStudentUseCase = createStudentUseCase;
  }

  async parseFile(fileContent, fileType) {
    if (fileType === "json") {
      return JSON.parse(fileContent);
    } else if (fileType === "xml") {
      const result = await xml2js.parseStringPromise(fileContent, {
        explicitArray: false,
      });
      return Array.isArray(result.students.student)
        ? result.students.student
        : [result.students.student];
    } else {
      throw new Error("Unsupported file type");
    }
  }

  async execute({ fileContent, fileType }) {
    const studentsData = await this.parseFile(fileContent, fileType);
    const imported = [];
    const errors = [];

    await Promise.all(
      studentsData.map(async (student, idx) => {
        try {
          const status = await this.statusRepository.findOneByCondition({
            name: student.status,
          });
          const faculty = await this.facultyRepository.findOneByCondition({
            name: student.faculty,
          });
          const program = await this.programRepository.findOneByCondition({
            name: student.program,
          });
          if (!status || !faculty || !program) {
            throw new Error(
              `Dữ liệu không hợp lệ cho sinh viên thứ ${idx + 1} (${student.fullName || student.mssv || ""})`
            );
          }
          student.status = status.id;
          student.faculty = faculty.id;
          student.program = program.id;
          const result = await this.createStudentUseCase.execute(student);
          imported.push(result);
        } catch (err) {
          errors.push({ student, error: err.message });
        }
      })
    );

    await addLogEntry({
      message: `Import sinh viên từ file ${fileType}`,
      level: "info",
      action: "import",
      entity: "student",
      user: "admin",
    });
    return { imported, errors };
  }
}

module.exports = ImportStudentsFromFileUseCase;
