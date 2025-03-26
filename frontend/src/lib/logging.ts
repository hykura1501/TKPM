import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import type { LogEntry } from "@/types/student";

// Hàm tạo ID ngẫu nhiên
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Tạo logger với Winston và MongoDB transport
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      level: 'info',
      db: process.env.MONGODB_URI as string,
      collection: 'logs',
      options: { useUnifiedTopology: true }
    })
  ],
});

// Hàm thêm log mới
export const addLogEntry = async (logData: Omit<LogEntry, "id" | "timestamp">): Promise<LogEntry> => {
  const newLog: LogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...logData,
  };

  // Ghi log với Winston
  logger.log({
    ...newLog, // Đảm bảo giữ nguyên `id`, `timestamp`, `level`, `message`
    level: logData.level || 'info', // Ghi đè hoặc bổ sung nếu thiếu
  });


  console.log("New log entry:", newLog);

  return newLog;
};

// Hàm lấy tất cả log
export const getLogs = async (): Promise<LogEntry[]> => {
  const logs = await logger.query({
    order: 'desc',
    fields: ['message', 'level', 'timestamp'], // Cung cấp các trường cần lấy
  });
  
  return logs;
};