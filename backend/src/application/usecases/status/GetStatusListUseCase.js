// Use case: Get list of statuses
class GetStatusListUseCase {
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute() {
    return await this.statusRepository.findAll();
  }
}

module.exports = GetStatusListUseCase;
