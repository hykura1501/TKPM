// Use case: Update a program
const { addLogEntry } = require('@shared/utils/logging');
const mapper = require('@shared/utils/mapper');
const { programSchema } = require('@validators/programValidator');

class UpdateProgramUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   */
  constructor({ programRepository }) {
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
  }

  async execute(programData, language = 'vi') {
    // Validate schema
    const parsed = programSchema.safeParse({ ...programData });
    if (!parsed.success) {
      await addLogEntry({ message: 'Cập nhật chương trình học không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    const { id } = parsed.data;
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
    const programs = (await this.programRepository.findAll()).map((program) =>
      mapper.formatProgram(program, language)
    );
    await addLogEntry({ message: 'Cập nhật chương trình học thành công', level: 'info', action: 'update', entity: 'program', user: 'admin', details: 'Updated program: ' + parsed.data.name });
    return { message: "Cập nhật chương trình học thành công", programs };
  }
}

module.exports = UpdateProgramUseCase;

