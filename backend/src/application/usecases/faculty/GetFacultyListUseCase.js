const Mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');

class GetFacultyListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   */
  constructor({ facultyRepository }) {
    /** @type {import('@domain/repositories/IFacultyRepository')} */
    this.facultyRepository = facultyRepository;
  }

  async execute(language = 'vi') {
    const faculties = await this.facultyRepository.findAll();
    if (!faculties || faculties.length === 0) {
      await addLogEntry({ 
        message: "Không tìm thấy khoa nào", 
        level: "warn",
        action: 'get-list',
        entity: 'faculty',
        user: 'admin',
        details: 'No faculties found in database'
      });
      return [];
    }
    return faculties.map((faculty) => Mapper.formatFaculty(faculty, language));
  }
}

module.exports = GetFacultyListUseCase;
