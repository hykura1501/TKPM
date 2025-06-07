const Mapper = require('@helpers/Mapper');
const { addLogEntry } = require('@helpers/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { z } = require('zod');

const { facultySchema } = require('@validators/facultyValidator');

class CreateFacultyUseCase {
  constructor({ facultyRepository }) {
    this.facultyRepository = facultyRepository;
  }

  async validateFaculty(faculty, isUpdate = false) {
    const parsed = facultySchema.safeParse(faculty);
    if (!parsed.success) {
      await addLogEntry({ message: "Khoa không hợp lệ", level: "warn" });
      return { success: false, error: parsed.error.errors.message };
    }
    const existingFaculty = await this.facultyRepository.findOneByCondition({ code: parsed.data.code });
    if (!isUpdate && existingFaculty) {
      await addLogEntry({ message: "Mã khoa đã tồn tại", level: "warn" });
      return { success: false, error: "Mã khoa đã tồn tại" };
    }
    let existingFacultyName = null;
    for (const locale of SUPPORTED_LOCALES) {
      existingFacultyName = await this.facultyRepository.findOneByCondition({ [`name.${locale}`]: parsed.data.name });
      if (existingFacultyName) break;
    }
    if (!isUpdate && existingFacultyName) {
      await addLogEntry({ message: "Tên khoa đã tồn tại", level: "warn" });
      return { success: false, error: "Tên khoa đã tồn tại" };
    }
    return { success: true, data: parsed.data };
  }

  async execute(data, language = 'vi') {
    const validationResult = await this.validateFaculty(data);
    if (!validationResult.success) {
      await addLogEntry({ message: "Thêm khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: validationResult.error };
    }
    const faculty = validationResult.data;
    const newFaculty = {
      ...faculty,
      name: new Map(),
      description: new Map(),
    };
    SUPPORTED_LOCALES.forEach((locale) => {
      newFaculty.name.set(locale, data.name);
      newFaculty.description.set(locale, data.description || "");
    });
    await this.facultyRepository.create(newFaculty);
    const faculties = (await this.facultyRepository.findAll()).map((faculty) => Mapper.formatFaculty(faculty, language));
    await addLogEntry({ message: "Thêm khoa thành công", level: "info", action: "create", entity: "faculty", user: "admin", details: "Add new faculty: " + faculty.name });
    return { success: true, message: "Thêm khoa thành công", faculties };
  }
}

module.exports = CreateFacultyUseCase;
