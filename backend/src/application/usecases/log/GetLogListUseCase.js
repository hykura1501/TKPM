// Use case: Get list of logs
class GetLogListUseCase {
  constructor({ logRepository }) {
    this.logRepository = logRepository;
  }

  async execute() {
    return await this.logRepository.findAll();
  }
}

module.exports = GetLogListUseCase;
