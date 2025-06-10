// Use case: Delete a program
const { addLogEntry } = require('@shared/utils/logging');
const mapper = require('@shared/utils/mapper');

class DeleteProgramUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình học
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   */
  constructor({ programRepository, studentRepository }) {
    /** @type {import('@domain/repositories/IProgramRepository')} */
    this.programRepository = programRepository;
    /** @type {import('@domain/repositories/IStudentRepository')} */
    this.studentRepository = studentRepository;
  }

  async execute(id, language = 'vi') {
    if (!id) {
      await addLogEntry({ message: 'ID không được để trống', level: 'warn' });
      throw { status: 400, message: 'ID không được để trống' };
    }
    // Kiểm tra xem có sinh viên nào đang dùng chương trình này không
    const students = await this.studentRepository.findOneByCondition({ program: id });
    if (students) {
      await addLogEntry({ message: 'Không thể xóa chương trình học', level: 'warn' });
      throw { status: 400, message: 'Không thể xóa chương trình học' };
    }
    await this.programRepository.delete(id);
    const programs = (await this.programRepository.findAll()).map((program) =>
      mapper.formatProgram(program, language)
    )
    await addLogEntry({ message: 'Xóa chương trình học thành công', level: 'info', action: 'delete', entity: 'program', user: 'admin', details: 'Deleted program: ' + id });
    return { message: "Xóa chương trình học thành công", programs };
  }
}

module.exports = DeleteProgramUseCase;

