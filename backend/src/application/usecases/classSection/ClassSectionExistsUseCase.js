// Use case: Check if a class section exists by id
class ClassSectionExistsUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ classSectionRepository }) {
    this.classSectionRepository = classSectionRepository;
  }

  async execute(id) {
    const classSection = await this.classSectionRepository.findOneByCondition({ id });
    return !!classSection;
  }
}

module.exports = ClassSectionExistsUseCase;
