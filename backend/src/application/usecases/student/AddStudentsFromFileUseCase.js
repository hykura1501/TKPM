// Use case: Add multiple students from file
const { addLogEntry } = require('@shared/utils/logging');

class AddStudentsFromFileUseCase {
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

  async execute(studentsData) {
    // Lấy setting cho validate động
    const setting = this.settingRepository ? await this.settingRepository.findOneByCondition({}) : {};
    const allowedDomains = setting?.allowedEmailDomains || [];
    const phoneFormats = setting?.phoneFormats || [];
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
    const newStudents = [];
    for (const student of studentsData) {
      // Validate liên kết
      const status = await this.statusRepository.findOneByCondition({ name: student.status });
      const faculty = await this.facultyRepository.findOneByCondition({ name: student.faculty });
      const program = await this.programRepository.findOneByCondition({ name: student.program });
      if (!status || !faculty || !program) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      student.status = status.id;
      student.faculty = faculty.id;
      student.program = program.id;
      const parsed = dynamicSchema.safeParse(student);
      if (!parsed.success) {
        throw new Error(JSON.stringify(parsed.error.errors));
      }
      newStudents.push(parsed.data);
    }
    await this.studentRepository.createManyStudents(newStudents);
    await addLogEntry({ message: 'Thêm nhiều sinh viên từ file', level: 'info', action: 'create', entity: 'student', user: 'admin' });
    return newStudents;
  }
}

module.exports = AddStudentsFromFileUseCase;
