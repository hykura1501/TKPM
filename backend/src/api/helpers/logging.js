const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
// Function to generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const isTest = process.env.NODE_ENV === 'test';
// Define transport list
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


// Create logger with Winston and MongoDB transport
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: transportList,
});

// Function to add a new log entry
const addLogEntry = async (logData) => {
  const newLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...logData,
  };

  // Log with Winston
  logger.log({
    ...newLog, // Ensure `id`, `timestamp`, `level`, `message` are preserved
    level: logData.level || 'info', // Override or add if missing
  });

  console.log("New log entry:", newLog);

  return newLog;
};

// Function to get all logs
const getLogs = async () => {
  const logs = await logger.query({
    order: 'desc',
    fields: ['message', 'level', 'timestamp'], // Specify the fields to retrieve
  });

  return logs;
};

module.exports = {
  addLogEntry,
  getLogs,
};