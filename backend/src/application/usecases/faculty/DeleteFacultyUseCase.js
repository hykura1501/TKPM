const Mapper = require('@helpers/mapper');
const { addLogEntry } = require('@helpers/logging');

class DeleteFacultyUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ message: "ID khoa không được để trống", level: "warn" });
      throw { status: 400, message: "ID khoa không được để trống" };
    }
    const existingFaculty = await this.facultyRepository.findOneByCondition({ id });
    if (!existingFaculty) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    await this.facultyRepository.delete(id);
    const faculties = (await this.facultyRepository.findAll()).map((faculty) => Mapper.formatFaculty(faculty, language));
    await addLogEntry({ message: "Xóa khoa thành công", level: "info", action: "delete", entity: "faculty", user: "admin", details: `Deleted faculty: ${id}` });
    return { success: true, message: "Xóa khoa thành công", faculties };
  }
}

module.exports = DeleteFacultyUseCase;
