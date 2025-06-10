// Use case: Create a new program
const { programSchema } = require("@validators/programValidator");
const { addLogEntry } = require("@shared/utils/logging");
const { SUPPORTED_LOCALES } = require("@configs/locales");
const mapper = require("@shared/utils/mapper");

class CreateProgramUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
  }

  async execute(programData, language = "vi") {
    // Validate schema
    const parsed = programSchema.safeParse(programData);
    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm chương trình học không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: parsed.error.errors };
    }
    // Sinh id mới
    const newId = Date.now().toString();
    const newProgram = { name: new Map(), id: newId };
    SUPPORTED_LOCALES.forEach((locale) => {
      newProgram.name.set(locale, parsed.data.name);
    });
    newProgram.faculty = parsed.data.faculty;
    await this.programRepository.create(newProgram);
    const programs = (await this.programRepository.findAll()).map((program) =>
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
    return { message: "Thêm chương trình học thành công", program: programs };
  }
}

module.exports = CreateProgramUseCase;
