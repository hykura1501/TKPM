const { logEntrySchema } = require('@validators/logValidator');

// Use case: Get list of logs
class AddLogUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/ILogRepository')} params.logRepository - Repository thao tác log
   */
  constructor({ logRepository }) {
    /** @type {import('@domain/repositories/ILogRepository')} */
    this.logRepository = logRepository;
  }

  async execute(data) {
    const parsed = logEntrySchema.safeParse(data);
    if (!parsed.success) {
      throw { status: 400, message: parsed.error.errors };
    }

    const newLog = await this.logRepository.create(parsed.data);
    return { message: "Thêm log thành công", log: newLog };
  }
}

module.exports = AddLogUseCase;
