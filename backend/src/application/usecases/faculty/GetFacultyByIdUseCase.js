const { addLogEntry } = require('@shared/utils/logging');
const Mapper = require('@shared/utils/mapper');

class GetFacultyByIdUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ message: "ID khoa không được để trống", level: "warn" });
      throw { status: 400, message: "ID khoa không được để trống" };
    }
    const faculty = await this.facultyRepository.findOneByCondition({ id });
    if (!faculty) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    return Mapper.formatFaculty(faculty, language);
  }
}

module.exports = GetFacultyByIdUseCase;
