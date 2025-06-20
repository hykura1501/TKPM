// Use case: Get class section by id
const { addLogEntry } = require('@shared/utils/logging');

class GetClassSectionByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ classSectionRepository }) {
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id) {
    const classSection = await this.classSectionRepository.findOneByCondition({ id });
    if (!classSection) {
      await addLogEntry({ 
        message: "Không tìm thấy lớp học", 
        level: "warn",
        action: 'get',
        entity: 'classSection',
        user: 'admin',
        details: 'No classSection found for id: ' + id
      });
      throw { status: 404, message: "Không tìm thấy lớp học" };
    }
    return classSection;
  }
}

module.exports = GetClassSectionByIdUseCase;
