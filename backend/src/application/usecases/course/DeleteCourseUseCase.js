const Mapper = require('@helpers/mapper');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class DeleteCourseUseCase {
  constructor({ courseRepository, classSectionRepository }) {
    this.courseRepository = courseRepository;
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ message: "ID khóa học không được để trống", level: "warn" });
      throw { status: 400, message: "ID khóa học không được để trống" };
    }
    const existingCourse = await this.courseRepository.findOneByCondition({ id });
    if (!existingCourse) {
      await addLogEntry({ message: "Khóa học không tồn tại", level: "warn" });
      throw { status: 404, message: "Khóa học không tồn tại" };
    }
    const classSection = await this.classSectionRepository.findOneByCondition({ course: id });
    if (classSection) {
      await addLogEntry({ message: "Không thể xóa khóa học đang được sử dụng", level: "warn" });
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
