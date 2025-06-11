// Interface for Setting Repository (Domain Layer)
class ISettingRepository {
  /**
   * @returns {Promise<Array<any>>}
   */
  async findAll() { throw new Error('Not implemented'); }
  /**
   * @param {string} id
   * @param {any} data
   * @returns {Promise<any>}
   */
  async update(id, data) { throw new Error('Not implemented'); }
  /**
   * @param {any} condition
   * @returns {Promise<any>}
   */
  async findOneByCondition(condition) { throw new Error('Not implemented'); }
}

module.exports = ISettingRepository;
