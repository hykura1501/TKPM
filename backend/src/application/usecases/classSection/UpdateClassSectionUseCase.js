// Use case: Update a class section
const { classSectionSchema } = require('@validators/classSectionValidator');
const { addLogEntry } = require('@helpers/logging');

class UpdateClassSectionUseCase {
  constructor({ classSectionRepository, courseRepository }) {
    this.classSectionRepository = classSectionRepository;
    this.courseRepository = courseRepository;
  }

  async execute(data) {
    // Validate schema
    const parsed = classSectionSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: 'Cập nhật lớp học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại lớp học
    const existingClassSection = await this.classSectionRepository.findOneByCondition({ id: parsed.data.id });
    if (!existingClassSection) {
      await addLogEntry({ message: 'Lớp học không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Lớp học không tồn tại' };
    }
    // Kiểm tra tồn tại khóa học
    const existingCourse = await this.courseRepository.findOneByCondition({ id: parsed.data.courseId });
    if (!existingCourse) {
      await addLogEntry({ message: 'Khóa học không tồn tại', level: 'warn' });
      throw { status: 400, message: 'Khóa học không tồn tại' };
    }
    // Cập nhật lớp học
    await this.classSectionRepository.update(parsed.data.id, parsed.data);
    await addLogEntry({ message: 'Cập nhật lớp học thành công', level: 'info', action: 'update', entity: 'classSection', user: 'admin', details: 'Updated classSection: ' + parsed.data.code });
    return { success: true };
  }
}

module.exports = UpdateClassSectionUseCase;
