// Use case: Get status transition rules
class GetStatusRulesUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   */
  constructor({ statusRepository }) {
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
  }

  async execute() {
    const statuses = await this.statusRepository.findAll();
    return statuses.map(item => ({ fromStatus: item.id, toStatus: item.allowedStatus }));
  }
}

module.exports = GetStatusRulesUseCase;
