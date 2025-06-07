// Domain Entity - Log
class Log {
  constructor({ timestamp, level, message, metadata }) {
    this.timestamp = timestamp;
    this.level = level;
    this.message = message;
    this.metadata = metadata;
  }
}
module.exports = Log;
