// Interface for Counter Repository (Domain Layer)
class ICounterRepository {
  async findOneByName(name) { throw new Error('Not implemented'); }
  async updateValue(name, value) { throw new Error('Not implemented'); }
  async increment(name) { throw new Error('Not implemented'); }
}

module.exports = ICounterRepository;
