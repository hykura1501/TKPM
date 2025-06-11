// Use case: Get list of class sections
class GetClassSectionListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IClassSectionRepository')} params.classSectionRepository - Repository thao tác lớp học phần
   */
  constructor({ classSectionRepository }) {
    /** @type {import('@domain/repositories/IClassSectionRepository')} */
    this.classSectionRepository = classSectionRepository;
  }

  async execute() {
    return await this.classSectionRepository.findAll();
  }
}

module.exports = GetClassSectionListUseCase;
