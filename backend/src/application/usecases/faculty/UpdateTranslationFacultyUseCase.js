const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@helpers/logging');

class UpdateTranslationFacultyUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async execute(facultyId, translations) {
    if (!facultyId) {
      await addLogEntry({ message: "ID khoa không được để trống", level: "warn" });
      throw { status: 400, message: "ID khoa không được để trống" };
    }
    const faculty = await this.facultyRepository.findOneByCondition({ id: facultyId });
    if (!faculty) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        faculty.name.set(locale, translations[locale].facultyName);
        faculty.description.set(locale, translations[locale].description);
      }
    });
    await this.facultyRepository.update(facultyId, {
      name: faculty.name,
      description: faculty.description,
    });
    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = UpdateTranslationFacultyUseCase;
