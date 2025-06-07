// Use case: Update a program
const { programSchema } = require('@validators/programValidator');
const { addLogEntry } = require('@helpers/logging');

class UpdateProgramUseCase {
  constructor({ programRepository }) {
    this.programRepository = programRepository;
  }

  async execute(id, programData, language = 'vi') {
    // Validate schema
    const parsed = programSchema.safeParse({ ...programData, id });
    if (!parsed.success) {
      await addLogEntry({ message: 'Cập nhật chương trình học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại chương trình
    const program = await this.programRepository.findOneByCondition({ id });
    if (!program) {
      await addLogEntry({ message: 'Chương trình học không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Chương trình học không tồn tại' };
    }
    // Cập nhật tên đa ngôn ngữ
    program.name.set(language, parsed.data.name);
    await this.programRepository.update(id, {
      name: program.name,
      faculty: parsed.data.faculty,
    });
    await addLogEntry({ message: 'Cập nhật chương trình học thành công', level: 'info', action: 'update', entity: 'program', user: 'admin', details: 'Updated program: ' + parsed.data.name });
    return { success: true };
  }
}

module.exports = UpdateProgramUseCase;

