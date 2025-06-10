// Interface for Log Repository (Domain Layer)
class ILogRepository {
  /**
   * @returns {Promise<Array<any>>}
   */
  async findAll() { throw new Error('Not implemented'); }
  /**
   * @param {any} data
   * @returns {Promise<any>}
   */
  async create(data) { throw new Error('Not implemented'); }
  /**
   * @param {string} id
   * @returns {Promise<any>}
   */
  async findById(id) { throw new Error('Not implemented'); }
}

module.exports = ILogRepository;
