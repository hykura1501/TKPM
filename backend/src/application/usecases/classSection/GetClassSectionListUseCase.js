// Use case: Get list of class sections
class GetClassSectionListUseCase {
  constructor({ classSectionRepository }) {
    this.classSectionRepository = classSectionRepository;
  }

  async execute() {
    return await this.classSectionRepository.findAll();
  }
}

module.exports = GetClassSectionListUseCase;
