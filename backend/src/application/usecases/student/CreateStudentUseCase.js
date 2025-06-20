// Use case: Create a new student
const { studentSchema } = require("@validators/studentValidator");
const { addLogEntry } = require("@shared/utils/logging");

class CreateStudentUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@infrastructure/repositories/SettingRepository')} params.settingRepository - Use case lấy tất cả cài đặt
   * @param {import('@infrastructure/repositories/FacultyRepository')} params.facultyRepository - Service kiểm tra khoa
   * @param {import('@infrastructure/repositories/ProgramRepository')} params.programRepository - Repository thao tác chương trình
   * @param {import('@infrastructure/repositories/StatusRepository')} params.statusRepository - Repository thao tác trạng thái sinh viên
   * 
   */
  constructor({ studentRepository, settingRepository, facultyRepository, programRepository, statusRepository }) {
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
    /** @type {import('@infrastructure/repositories/SettingRepository')} */
    this.settingRepository = settingRepository;
    /** @type {import('@infrastructure/repositories/FacultyRepository')} */
    this.facultyRepository = facultyRepository;
    /** @type {import('@infrastructure/repositories/ProgramRepository')} */
    this.programRepository = programRepository;
    /** @type {import('@infrastructure/repositories/StatusRepository')} */
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
    const setting = await this.getAllSetting();
    const allowedDomains = setting?.allowedEmailDomains || [];
    const phoneFormats = setting?.phoneFormats || [];

    const parsed = studentSchema.safeParse(studentData);
    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm sinh viên không hợp lệ",
        level: "warn",
        action: "create",
        entity: "student",
        user: "admin",
        details: 'Invalid student data: ' + JSON.stringify(studentData)
      });
      throw new Error(JSON.stringify(parsed.error.errors));
    }
    //Kiểm tra email và phone theo các định dạng đã cho
    if (!allowedDomains.includes(parsed.data.email.split("@")[1])) {
      throw new Error(
        "Email phải thuộc một trong các tên miền: " +
          allowedDomains.join(", ")
      );
    }
    if (
      !phoneFormats.some((format) =>
        new RegExp(format.pattern).test(parsed.data.phone)
      )
    ) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    if (!(await this.facultyRepository.findOneByCondition({id: parsed.data.faculty }))) {
      throw new Error("Khoa không tồn tại");
    }
    if (!(await this.programRepository.findOneByCondition({id: parsed.data.program}))) {
      throw new Error("Chương trình không tồn tại");
    }
    if (!(await this.statusRepository.findOneByCondition({id: parsed.data.status}))) {
      throw new Error("Trạng thái sinh viên không tồn tại");
    }

    const newMssv = await this.studentRepository.getNextMssv();
    const newStudent = { ...parsed.data, mssv: newMssv };

    await this.studentRepository.createStudent(newStudent);
    await addLogEntry({
      message: "Thêm sinh viên mới",
      level: "info",
      action: "create",
      entity: "student",
      user: "admin",
      details: `Created student: ${newStudent.fullName}`
    });

    return newStudent;
  }
}

module.exports = CreateStudentUseCase;
