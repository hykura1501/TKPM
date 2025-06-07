// Use case: Create a new class section
const { classSectionSchema } = require('@validators/classSectionValidator');
const { addLogEntry } = require('@helpers/logging');

class CreateClassSectionUseCase {
  constructor({ classSectionRepository, courseRepository }) {
    this.classSectionRepository = classSectionRepository;
    this.courseRepository = courseRepository;
  }

  async execute(data) {
    // Validate schema
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
    const newId = Date.now().toString();
    const newClassSection = { ...parsed.data, id: newId };
    await this.classSectionRepository.create(newClassSection);
    await addLogEntry({ message: 'Thêm lớp học thành công', level: 'info', action: 'create', entity: 'classSection', user: 'admin', details: 'Add new classSection: ' + parsed.data.code });
    return { success: true, classSection: newClassSection };
  }
}

module.exports = CreateClassSectionUseCase;
