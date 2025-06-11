// Use case: Get list of logs
class GetLogListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ILogRepository')} params.logRepository - Repository thao tác log
   */
  constructor({ logRepository }) {
    /** @type {import('@domain/repositories/ILogRepository')} */
    this.logRepository = logRepository;
  }

  async execute() {
    return await this.logRepository.findAll();
  }
}

module.exports = GetLogListUseCase;
