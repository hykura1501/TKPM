const Log = require('../models/Log');

class LogRepository {
  async findAll() {
    return await Log.find({});
  }

  async create(data) {
    const newLog = new Log(data);
    return await newLog.save();
  }
}

module.exports = new LogRepository();