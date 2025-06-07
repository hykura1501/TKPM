// LogRepository implements ILogRepository (Infrastructure Layer)
const LogModel = require('../../api/models/Log');
const ILogRepository = require('../../domain/repositories/ILogRepository');

const Log = require('../../domain/entities/Log');
class LogRepository extends ILogRepository {
  async findAll() {
    const docs = await LogModel.find({});
    return docs.map(doc => new Log(doc));
  }
  async create(data) {
    const newLog = new LogModel(data);
    return await newLog.save();
  }
  async findById(id) {
    return await LogModel.findById(id);
  }
}
module.exports = LogRepository;
