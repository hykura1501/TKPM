const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class GetTranslationFacultyUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   */
  constructor({ facultyRepository }) {
    /** @type {import('@domain/repositories/IFacultyRepository')} */
    this.facultyRepository = facultyRepository;
  }

  async execute(facultyId) {
    if (!facultyId) {
      await addLogEntry({ 
        message: "ID khoa không được để trống", 
        level: "warn",
        action: 'get-translation',
        entity: 'faculty',
        user: 'admin',
        details: 'Empty facultyId provided for get translation'
      });
      throw { status: 400, message: "ID khoa không được để trống" };
    }
    const faculty = await this.facultyRepository.findOneByCondition({ id: facultyId });
    if (!faculty) {
      await addLogEntry({ 
        message: "Khoa không tồn tại", 
        level: "warn",
        action: 'get-translation',
        entity: 'faculty',
        user: 'admin',
        details: 'Faculty not found: ' + facultyId
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    // const translations = {
    //   en: {
    //     facultyName: faculty.name.get("en"),
    //     description: faculty.description.get("en"),
    //   },
    //   vi: {
    //     facultyName: faculty.name.get("vi"),
    //     description: faculty.description.get("vi"),
    //   },
    // };

    const translations = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      translations[locale] = {
        facultyName: faculty.name?.get?.(locale) || (faculty.name?.[locale] ?? null),
        description: faculty.description?.get?.(locale) || (faculty.description?.[locale] ?? null),
      };
    });
    return translations;
  }
}

module.exports = GetTranslationFacultyUseCase;
