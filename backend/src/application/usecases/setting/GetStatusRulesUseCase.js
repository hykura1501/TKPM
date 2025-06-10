// Use case: Get status transition rules (for settings)
class GetStatusRulesUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute() {
    const statuses = await this.statusRepository.findAll();
    return statuses.map(item => ({ fromStatus: item.id, toStatus: item.allowedStatus }));
  }
}

module.exports = GetStatusRulesUseCase;
