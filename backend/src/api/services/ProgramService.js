const ProgramRepository = require("../repositories/ProgramRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const { z } = require("zod");
const mapper = require("../helpers/Mapper");
const { SUPPORTED_LOCALES } = require("../../configs/locales");

const programSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Tên chương trình học không được để trống" }),
  faculty: z.string().min(1, { message: "Khoa không được để trống" }),
});

class ProgramService {
  async getListPrograms(language = "vi") {
    const programs = await ProgramRepository.findAll();
    const mappedPrograms = programs.map((program) =>
      mapper.formatProgram(program, language)
    );
    return mappedPrograms;
  }

  async addProgram(data, language = "vi") {
    const parsed = programSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm chương trình học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: parsed.error.errors };
    }

    const newId = await ProgramRepository.getNextId();
    const newProgram = { name: new Map(), id: newId };

    SUPPORTED_LOCALES.forEach((locale) => {
      newFaculty.name.set(locale, parsed.data.name);
    });

    await ProgramRepository.create(newProgram);
    const programs = (await ProgramRepository.findAll()).map((program) =>
      mapper.formatProgram(program, language)
    );
    await addLogEntry({
      message: "Thêm chương trình học thành công",
      level: "info",
      action: "create",
      entity: "program",
      user: "admin",
      details: "Add new program: " + parsed.data.name,
    });
    return { message: "Thêm chương trình học thành công", programs };
  }

  async updateProgram(data, language = "vi") {
    const parsed = programSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Cập nhật chương trình học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: parsed.error.errors };
    }
    const program = await ProgramRepository.findOneByCondition({
      id: parsed.data.id,
    });
    if (!program) {
      await addLogEntry({
        message: "Chương trình học không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Chương trình học không tồn tại" };
    }
    program.name.set(language, parsed.data.name);

    await ProgramRepository.update(parsed.data.id, {
      name: program.name,
      faculty: parsed.data.faculty,
    });
    const programs = (await ProgramRepository.findAll().map((program) =>
      mapper.formatProgram(program, language)
    ))
    await addLogEntry({
      message: "Cập nhật chương trình học thành công",
      level: "info",
      action: "update",
      entity: "program",
      user: "admin",
      details: "Updated program: " + parsed.data.name,
    });
    return { message: "Cập nhật chương trình học thành công", programs };
  }

  async deleteProgram(id, language = "vi") {  
    if (!id) {
      await addLogEntry({ message: "ID không được để trống", level: "warn" });
      throw { status: 400, message: "ID không được để trống" };
    }

    const students = await StudentRepository.findOneByCondition({
      program: id,
    });
    if (students) {
      await addLogEntry({
        message: "Không thể xóa chương trình học",
        level: "warn",
      });
      throw { status: 400, message: "Không thể xóa chương trình học" };
    }

    await ProgramRepository.delete(id);
    const programs = (await ProgramRepository.findAll().map((program) =>
      mapper.formatProgram(program, language)
    ))
    await addLogEntry({
      message: "Xóa chương trình học thành công",
      level: "info",
      action: "delete",
      entity: "program",
      user: "admin",
      details: "Deleted program: " + id,
    });
    return { message: "Xóa chương trình học thành công", programs };
  }
  async programExists(id) {
    const program = await ProgramRepository.findOneByCondition({ id });
    return !!program;
  }

  async getTranslationProgramById(programId) {
    if (!programId) {
      await addLogEntry({
        message: "ID chương trình không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID chương trình không được để trống" };
    }

    // Lấy chương trình từ cơ sở dữ liệu
    const program = await ProgramRepository.findOneByCondition({
      id: programId,
    });
    if (!program) {
      await addLogEntry({
        message: "Khoa không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }

    // Định dạng dữ liệu bản dịch
    const translations = {
      en: {
        programName: program.name.get("en"),
      },
      vi: {
        programName: program.name.get("vi"),
      },
    };

    return translations;
  }

  async updateTranslationProgram(programId, translations) {
    if (!programId) {
      await addLogEntry({
        message: "ID chương trình không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID chương trình không được để trống" };
    }

    // Lấy chương trình từ cơ sở dữ liệu
    const program = await ProgramRepository.findOneByCondition({
      id: programId,
    });
    if (!program) {
      await addLogEntry({
        message: "Khoa không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }

    // Cập nhật bản dịch
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        program.name.set(locale, translations[locale].programName);
      }
    });

    await ProgramRepository.update(programId, {
      name: program.name,
    });

    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = new ProgramService();
