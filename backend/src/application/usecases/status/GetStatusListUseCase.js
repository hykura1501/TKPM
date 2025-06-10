const mapper = require('@shared/utils/mapper');

// Use case: Get list of statuses
class GetStatusListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   */
  constructor({ statusRepository }) {
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
  }

  async execute(language = 'vi') {
    const statuses = await this.statusRepository.findAll();
    return statuses.map((status) => mapper.formatStatus(status, language));
  }
}

module.exports = GetStatusListUseCase;
