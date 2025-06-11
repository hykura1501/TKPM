// Use case: Check if a status exists by id
class StatusExistsUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute(id) {
    const status = await this.statusRepository.findOneByCondition({ id });
    return !!status;
  }
}

module.exports = StatusExistsUseCase;
