// Use case: Update a student
const { studentSchema } = require('../../validators/studentValidator');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateStudentUseCase {
  constructor({ studentRepository, settingRepository, facultyRepository, programRepository, statusRepository }) {
    this.studentRepository = studentRepository;
    this.settingRepository = settingRepository;
    this.facultyRepository = facultyRepository;
    this.programRepository = programRepository;
    this.statusRepository = statusRepository;
  }

  async execute(mssv, studentData) {
    // Lấy setting cho validate động
    const setting = this.settingRepository ? await this.settingRepository.findOneByCondition({}) : {};
    const allowedDomains = setting?.allowedEmailDomains || [];
    const phoneFormats = setting?.phoneFormats || [];
    // Validate schema + email domain + phone
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
      await addLogEntry({ message: 'Cập nhật sinh viên không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    // Kiểm tra tồn tại sinh viên
    const currentStudent = await this.studentRepository.findStudentByMssv(mssv);
    if (!currentStudent) {
      await addLogEntry({ message: 'Sinh viên không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Sinh viên không tồn tại' };
    }
    // Kiểm tra tồn tại faculty/program/status nếu có
    if (this.facultyRepository && parsed.data.faculty) {
      const faculty = await this.facultyRepository.findOneByCondition({ id: parsed.data.faculty });
      if (!faculty) throw { status: 400, message: 'Khoa không tồn tại' };
    }
    if (this.programRepository && parsed.data.program) {
      const program = await this.programRepository.findOneByCondition({ id: parsed.data.program });
      if (!program) throw { status: 400, message: 'Chương trình không tồn tại' };
    }
    if (this.statusRepository && parsed.data.status) {
      const status = await this.statusRepository.findOneByCondition({ id: parsed.data.status });
      if (!status) throw { status: 400, message: 'Trạng thái không tồn tại' };
    }
    // Cập nhật sinh viên
    await this.studentRepository.updateStudent(mssv, parsed.data);
    await addLogEntry({ message: 'Cập nhật sinh viên thành công', level: 'info', action: 'update', entity: 'student', user: 'admin', details: `Updated student: ${parsed.data.fullName}` });
    return { success: true };
  }
}

module.exports = UpdateStudentUseCase;

