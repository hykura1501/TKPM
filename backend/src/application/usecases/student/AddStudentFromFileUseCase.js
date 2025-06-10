// Use case: Add a single student from file
const { addLogEntry } = require('@shared/utils/logging');

class AddStudentFromFileUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@domain/repositories/ISettingRepository')} params.settingRepository - Repository thao tác cài đặt
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   */
  constructor({ studentRepository, settingRepository, facultyRepository, programRepository, statusRepository }) {
    this.studentRepository = studentRepository;
    this.settingRepository = settingRepository;
    this.facultyRepository = facultyRepository;
    this.programRepository = programRepository;
    this.statusRepository = statusRepository;
  }

  async execute(studentData) {
    const setting = this.settingRepository ? await this.settingRepository.findOneByCondition({}) : {};
    const allowedDomains = setting?.allowedEmailDomains || [];
    const phoneFormats = setting?.phoneFormats || [];
    const status = await this.statusRepository.findOneByCondition({ name: studentData.status });
    const faculty = await this.facultyRepository.findOneByCondition({ name: studentData.faculty });
    const program = await this.programRepository.findOneByCondition({ name: studentData.program });
    if (!status || !faculty || !program) {
      throw new Error('Dữ liệu không hợp lệ');
    }
    studentData.status = status.id;
    studentData.faculty = faculty.id;
    studentData.program = program.id;
    const studentSchema = require('../../validators/studentValidator').studentSchema;
    const dynamicSchema = studentSchema.extend({
      email: studentSchema.shape.email.refine(
        (email) => allowedDomains.length === 0 || allowedDomains.includes(email.split('@')[1]),
        { message: 'Email phải thuộc một trong các tên miền: ' + allowedDomains.join(', ') }
      ),
      phone: studentSchema.shape.phone.refine(
        (phone) => phoneFormats.length === 0 || phoneFormats.some((format) => new RegExp(format.pattern).test(phone)),
        { message: 'Số điện thoại không hợp lệ' }
      ),
    });
    const parsed = dynamicSchema.safeParse(studentData);
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.errors));
    }
    const newMssv = await this.studentRepository.getNextMssv();
    const newStudent = { ...parsed.data, mssv: newMssv };
    await this.studentRepository.createStudent(newStudent);
    await addLogEntry({ message: 'Thêm sinh viên từ file', level: 'info', action: 'create', entity: 'student', user: 'admin' });
    return newStudent;
  }
}

module.exports = AddStudentFromFileUseCase;
