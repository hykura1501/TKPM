// Use case: Delete a class section
const { addLogEntry } = require('@shared/utils/logging');

class DeleteClassSectionUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ classSectionRepository }) {
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id) {
    if (!id) {
      await addLogEntry({ message: 'ID lớp học không được để trống', level: 'warn' });
      throw { status: 400, message: 'ID lớp học không được để trống' };
    }
    // Kiểm tra tồn tại lớp học
    const existingClassSection = await this.classSectionRepository.findOneByCondition({ id });
    if (!existingClassSection) {
      await addLogEntry({ message: 'Lớp học không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Lớp học không tồn tại' };
    }
    // Kiểm tra sĩ số
    if (existingClassSection.currentEnrollment > 0) {
      await addLogEntry({ message: 'Không thể xóa lớp học đang được sử dụng', level: 'warn' });
      throw { status: 400, message: 'Không thể xóa lớp học đang được sử dụng' };
    }
    await this.classSectionRepository.delete(id);
    const classSections = await this.classSectionRepository.findAll();
    await addLogEntry({ message: 'Xóa lớp học thành công', level: 'info', action: 'delete', entity: 'classSection', user: 'admin', details: `Deleted classSection: ${id}` });
    return { success: true, message: "Xóa lớp học thành công", classSections };
  }
}

module.exports = DeleteClassSectionUseCase;
