// Interface for Status Repository (Domain Layer)
class IStatusRepository {
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
   * @param {any} data
   * @returns {Promise<any>}
   */
  async update(id, data) { throw new Error('Not implemented'); }
  /**
   * @param {string} id
   * @returns {Promise<any>}
   */
  async delete(id) { throw new Error('Not implemented'); }
  /**
   * @param {any} condition
   * @returns {Promise<any>}
   */
  async findOneByCondition(condition) { throw new Error('Not implemented'); }
  /**
   * @returns {Promise<string>}
   */
  async getNextId() { throw new Error('Not implemented'); }
}

module.exports = IStatusRepository;
