// Interface for Log Repository (Domain Layer)
class ILogRepository {
  async findAll() { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
}

module.exports = ILogRepository;
