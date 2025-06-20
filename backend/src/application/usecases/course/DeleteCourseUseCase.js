const { addLogEntry } = require('@shared/utils/logging');
const Mapper = require('@shared/utils/mapper');

class DeleteCourseUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ICourseRepository')} params.courseRepository - Repository thao tác khóa học
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ courseRepository, classSectionRepository }) {
    /** @type {import('@domain/repositories/ICourseRepository')} */
    this.courseRepository = courseRepository;
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ 
        message: "ID khóa học không được để trống", 
        level: "warn",
        action: 'delete',
        entity: 'course',
        user: 'admin',
        details: 'Empty id provided for delete'
      });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const existingCourse = await this.courseRepository.findOneByCondition({ id });
    if (!existingCourse) {
      await addLogEntry({ 
        message: "Khóa học không tồn tại", 
        level: "warn",
        action: 'delete',
        entity: 'course',
        user: 'admin',
        details: 'Course not found: ' + id
      });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    const classSection = await this.classSectionRepository.findOneByCondition({ course: id });
    if (classSection) {
      await addLogEntry({ 
        message: "Không thể xóa khóa học đang được sử dụng", 
        level: "warn",
        action: 'delete',
        entity: 'course',
        user: 'admin',
        details: 'Attempted to delete course in use: ' + id
      });
      await this.courseRepository.update(id, { isActive: false });
      const courses = (await this.courseRepository.findAll()).map((course) => Mapper.formatCourse(course, language));
      return { success: true, message: "Khóa học đã được vô hiệu hóa", courses };
    }
    await this.courseRepository.delete(id);
    const courses = (await this.courseRepository.findAll()).map((course) => Mapper.formatCourse(course, language));
    await addLogEntry({ message: "Xóa khóa học thành công", level: "info", action: "delete", entity: "course", user: "admin", details: `Deleted course: ${id}` });
    return { success: true, message: "Xóa khóa học thành công", courses };
  }
}

module.exports = DeleteCourseUseCase;
