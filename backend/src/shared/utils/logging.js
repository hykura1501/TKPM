// shared/utils/logging.js
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const isTest = process.env.NODE_ENV === 'test';
const transportList = [
  new transports.Console()
];

if (!isTest) {
  transportList.push(
    new transports.MongoDB({
      level: 'info',
      db: process.env.MONGODB_URI,
      collection: 'logs',
      options: { useUnifiedTopology: true }
    })
  );
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: transportList,
});

const addLogEntry = async (logData) => {
  const newLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...logData,
  };
  logger.log({
    ...newLog,
    level: logData.level || 'info',
  });
  console.log("New log entry:", newLog);
  return newLog;
};

const getLogs = async () => {
  const logs = await logger.query({
    order: 'desc',
    fields: ['message', 'level', 'timestamp'],
  });
  return logs;
};

module.exports = {
  addLogEntry,
  getLogs,
};
