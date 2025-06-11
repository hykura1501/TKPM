// Use case: Create a new class section
const { classSectionSchema } = require('@validators/classSectionValidator');
const { addLogEntry } = require('@shared/utils/logging');

class CreateClassSectionUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   */
  constructor({ classSectionRepository, courseRepository }) {
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
  }

  async execute(data) {
    // Kiểm tra dữ liệu đầu vào
    const parsed = classSectionSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: 'Mã lớp học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra trùng mã lớp
    const existingClassSection = await this.classSectionRepository.findOneByCondition({ code: parsed.data.code });
    if (existingClassSection) {
      await addLogEntry({ message: 'Mã lớp học đã tồn tại', level: 'warn' });
      throw { status: 400, message: 'Mã lớp học đã tồn tại' };
    }
    // Kiểm tra tồn tại khóa học
    const existingCourse = await this.courseRepository.findOneByCondition({ id: parsed.data.courseId });
    if (!existingCourse) {
      await addLogEntry({ message: 'Khóa học không tồn tại', level: 'warn' });
      throw { status: 400, message: 'Khóa học không tồn tại' };
    }
    // Sinh id mới
    const newId = await this.classSectionRepository.getNextId();
    const newClassSection = { ...parsed.data, id: newId };
    await this.classSectionRepository.create(newClassSection);
    const classSections = await this.classSectionRepository.findAll();
    await addLogEntry({ message: 'Thêm lớp học thành công', level: 'info', action: 'create', entity: 'classSection', user: 'admin', details: 'Add new classSection: ' + parsed.data.code });
    return { message: "Thêm lớp học thành công", classSection: classSections };
  }
}

module.exports = CreateClassSectionUseCase;
