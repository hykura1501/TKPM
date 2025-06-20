// Use case: Update a student
const { studentSchema } = require('../../validators/studentValidator');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateStudentUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@domain/repositories/ISettingRepository')} [params.settingRepository] - Repository thao tác cài đặt
   * @param {import('@domain/repositories/IFacultyRepository')} [params.facultyRepository] - Repository thao tác khoa
   * @param {import('@domain/repositories/IProgramRepository')} [params.programRepository] - Repository thao tác chương trình học
   * @param {import('@domain/repositories/IStatusRepository')} [params.statusRepository] - Repository thao tác tình trạng sinh viên
   */
  constructor({ studentRepository, settingRepository, facultyRepository, programRepository, statusRepository }) {
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
    /** @type {import('@domain/repositories/ISettingRepository')} */
    this.settingRepository = settingRepository;
    /** @type {import('@domain/repositories/IFacultyRepository')} */
    this.facultyRepository = facultyRepository;
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
  }

  
  async getAllSetting() {
    const settings = await this.settingRepository.findOneByCondition({ _id: "67e69a34c85ca96947abaae3" });
    if (!settings) {
      throw new Error("Không tìm thấy cài đặt");
    }
    const statuses = await this.statusRepository.findAll();
    const statusRules = statuses.map(item => ({
      fromStatus: item.id,
      toStatus: item.allowedStatus,
    }));
    return {
      statusTransitionRules: statusRules,
      allowedEmailDomains: settings.allowDomains,
      phoneFormats: settings.allowPhones,
    };
  }

  async execute(studentData) {
    // Lấy setting cho validate động
    const { mssv } = studentData;
    const setting = await this.getAllSetting();
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
      await addLogEntry({ 
        message: 'Cập nhật sinh viên không hợp lệ', 
        level: 'warn',
        action: 'update',
        entity: 'student',
        user: 'admin',
        details: 'Invalid student data: ' + JSON.stringify(studentData)
      });
      throw { status: 400, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    // Kiểm tra tồn tại sinh viên
    const currentStudent = await this.studentRepository.findStudentByMssv(mssv);
    if (!currentStudent) {
      await addLogEntry({ 
        message: 'Sinh viên không tồn tại', 
        level: 'warn',
        action: 'update',
        entity: 'student',
        user: 'admin',
        details: 'Student not found: ' + mssv
      });
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

