const { addLogEntry } = require('@helpers/logging');

class GetTranslationFacultyUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async execute(facultyId) {
    if (!facultyId) {
      await addLogEntry({ message: "ID khoa không được để trống", level: "warn" });
      throw { status: 400, message: "ID khoa không được để trống" };
    }
    const faculty = await this.facultyRepository.findOneByCondition({ id: facultyId });
    if (!faculty) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    const translations = {
      en: {
        facultyName: faculty.name.get("en"),
        description: faculty.description.get("en"),
      },
      vi: {
        facultyName: faculty.name.get("vi"),
        description: faculty.description.get("vi"),
      },
    };
    return translations;
  }
}

module.exports = GetTranslationFacultyUseCase;
