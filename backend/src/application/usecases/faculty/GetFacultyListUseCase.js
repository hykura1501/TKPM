const Mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');

class GetFacultyListUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async execute(language = 'vi') {
    const faculties = await this.facultyRepository.findAll();
    if (!faculties || faculties.length === 0) {
      await addLogEntry({ message: "Không tìm thấy khoa nào", level: "warn" });
      return [];
    }
    return faculties.map((faculty) => Mapper.formatFaculty(faculty, language));
  }
}

module.exports = GetFacultyListUseCase;
