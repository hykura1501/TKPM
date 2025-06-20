// Use case: Update status transition rules
const { addLogEntry } = require('@shared/utils/logging');

class UpdateStatusRulesUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   */
  constructor({ statusRepository }) {
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
  }

  async execute(statusTransitionsRules) {
    const parsedRules = JSON.parse(statusTransitionsRules);
    for (let rule of parsedRules) {
      await this.statusRepository.update(rule.fromStatus, { allowedStatus: rule.toStatus });
    }
    await addLogEntry({ 
      message: "Cập nhật quy tắc cho trạng thái thành công", 
      level: "info",
      action: "update",
      entity: "status",
      user: "admin",
      details: 'Updated status rules: ' + JSON.stringify(parsedRules)
    });
    return { message: "Cập nhật quy tắc cho trạng thái thành công" };
  }
}

module.exports = UpdateStatusRulesUseCase;
