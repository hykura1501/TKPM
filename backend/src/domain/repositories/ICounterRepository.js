// Interface for Counter Repository (Domain Layer)
class ICounterRepository {
  /**
   * @param {string} name
   * @returns {Promise<any>}
   */
  async findOneByName(name) { throw new Error('Not implemented'); }
  /**
   * @param {string} name
   * @param {number} value
   * @returns {Promise<any>}
   */
  async updateValue(name, value) { throw new Error('Not implemented'); }
  /**
   * @param {string} name
   * @returns {Promise<any>}
   */
  async increment(name) { throw new Error('Not implemented'); }
}

module.exports = ICounterRepository;
