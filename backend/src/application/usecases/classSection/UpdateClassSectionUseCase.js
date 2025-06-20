// Use case: Update a class section
const { classSectionSchema } = require('@validators/classSectionValidator');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateClassSectionUseCase {
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
    // Validate schema
    const parsed = classSectionSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ 
        message: 'Cập nhật lớp học không hợp lệ', 
        level: 'warn',
        action: 'validate',
        entity: 'classSection',
        user: 'admin',
        details: 'Invalid classSection data: ' + JSON.stringify(data)
      });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại lớp học
    const existingClassSection = await this.classSectionRepository.findOneByCondition({ id: parsed.data.id });
    if (!existingClassSection) {
      await addLogEntry({ 
        message: 'Lớp học không tồn tại', 
        level: 'warn',
        action: 'update',
        entity: 'classSection',
        user: 'admin',
        details: 'ClassSection not found: ' + parsed.data.id
      });
      throw { status: 404, message: 'Lớp học không tồn tại' };
    }
    // Kiểm tra tồn tại khóa học
    const existingCourse = await this.courseRepository.findOneByCondition({ id: parsed.data.courseId });
    if (!existingCourse) {
      await addLogEntry({ 
        message: 'Khóa học không tồn tại', 
        level: 'warn',
        action: 'update',
        entity: 'classSection',
        user: 'admin',
        details: 'Course not found: ' + parsed.data.courseId
      });
      throw { status: 400, message: 'Khóa học không tồn tại' };
    }
    // Cập nhật lớp học
    await this.classSectionRepository.update(parsed.data.id, parsed.data);
    const classSections = await this.classSectionRepository.findAll();
    await addLogEntry({ message: 'Cập nhật lớp học thành công', level: 'info', action: 'update', entity: 'classSection', user: 'admin', details: 'Updated classSection: ' + parsed.data.code });
    return { success: true, message: "Cập nhật lớp học thành công", classSections };
  }
}

module.exports = UpdateClassSectionUseCase;
