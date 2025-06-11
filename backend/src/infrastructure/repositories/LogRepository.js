// LogRepository implements ILogRepository (Infrastructure Layer)
const ILogRepository = require('@domain/repositories/ILogRepository');

const Log = require('@domain/entities/Log');
class LogRepository extends ILogRepository {
  async findAll() {
    return await Log.find({});
  }

  async create(data) {
    const newLog = new Log(data);
    return await newLog.save();
  }
  async findById(id) {
    return await Log.findById(id);
  }
}
module.exports = LogRepository;
