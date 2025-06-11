const Mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { z } = require('zod');

const { facultySchema } = require('@validators/facultyValidator');

class CreateFacultyUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   */
  constructor({ facultyRepository }) {
    /** @type {import('@domain/repositories/IFacultyRepository')} */
    this.facultyRepository = facultyRepository;
  }


  async execute(data, language = 'vi') {
    const parsed = facultySchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }
    const faculty = parsed.data;
    const newId = await this.facultyRepository.getNextId();

    const newFaculty = { name: new Map(), id: newId };

    SUPPORTED_LOCALES.forEach((locale) => {
      newFaculty.name.set(locale, parsed.data.name);
    })
    await this.facultyRepository.create(newFaculty);
    const faculties = (await this.facultyRepository.findAll()).map((faculty) => Mapper.formatFaculty(faculty, language));
    await addLogEntry({ message: "Thêm khoa thành công", level: "info", action: "create", entity: "faculty", user: "admin", details: "Add new faculty: " + faculty.name });
    return { success: true, message: "Thêm khoa thành công", faculties };
  }
}

module.exports = CreateFacultyUseCase;
