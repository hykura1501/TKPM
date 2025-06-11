const Mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { z } = require('zod');

const { facultySchema } = require('@validators/facultyValidator');

class UpdateFacultyUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   */
  constructor({ facultyRepository }) {
    /** @type {import('@domain/repositories/IFacultyRepository')} */
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
    const validationResult = await this.validateFaculty(data, true);
    if (!validationResult.success) {
      await addLogEntry({ message: "Cập nhật khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: validationResult.error };
    }
    const existingFaculty = await this.facultyRepository.findOneByCondition({ id: validationResult.data.id });
    if (!existingFaculty) {
      await addLogEntry({ message: "Khoa không tồn tại", level: "warn" });
      throw { status: 404, message: "Khoa không tồn tại" };
    }
    existingFaculty.name.set(language, data.name);
    validationResult.data.name = new Map();
    validationResult.data.name = existingFaculty.name;
    await this.facultyRepository.update(validationResult.data.id, validationResult.data);
    await this.facultyRepository.update(validationResult.data.id, {
      name: existingFaculty.name,
      description: existingFaculty.description,
    });
    const faculties = (await this.facultyRepository.findAll()).map((faculty) => Mapper.formatFaculty(faculty, language));
    await addLogEntry({ message: "Cập nhật khoa thành công", level: "info", action: "update", entity: "faculty", user: "admin", details: "Updated faculty: " + validationResult.data.name });
    return { success: true, message: "Cập nhật khoa thành công", faculties };
  }
}

module.exports = UpdateFacultyUseCase;
