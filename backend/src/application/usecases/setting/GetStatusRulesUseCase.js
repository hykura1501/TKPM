const mapper = require('@shared/utils/mapper');

// Use case: Get status transition rules (for settings)
class GetStatusRulesUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }
  generateStatusTransitionRules(statusList) {
    const idToNameMap = {};
    statusList.forEach(status => {
      idToNameMap[status.id] = status.name;
    });
  
    const transitionRules = {};
    statusList.forEach(status => {
      transitionRules[status.name] = status.allowedStatus
        .map(id => idToNameMap[id])
        .filter(Boolean);
    });
  
    return transitionRules;
  }

  async execute(language = 'vi') {
    const statuses = await this.statusRepository.findAll();
    const statusList = statuses.map((status) => mapper.formatStatus(status, language));
    return this.generateStatusTransitionRules(statusList);
  } 
}

module.exports = GetStatusRulesUseCase;
