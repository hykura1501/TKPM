// Use case: Create a new program
const { programSchema } = require('@validators/programValidator');
const { addLogEntry } = require('@helpers/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class CreateProgramUseCase {
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute(programData) {
    // Validate schema
    const parsed = programSchema.safeParse(programData);
    if (!parsed.success) {
      await addLogEntry({ message: 'Thêm chương trình học không hợp lệ', level: 'warn' });
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
    await addLogEntry({ message: 'Thêm chương trình học thành công', level: 'info', action: 'create', entity: 'program', user: 'admin', details: 'Add new program: ' + parsed.data.name });
    return { success: true, program: newProgram };
  }
}

module.exports = CreateProgramUseCase;

