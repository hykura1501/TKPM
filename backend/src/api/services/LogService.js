const LogRepository = require('../repositories/LogRepository');
const { z } = require('zod');

const logEntrySchema = z.object({
  timestamp: z.string(),
  message: z.string(),
  level: z.enum(['info', 'warn', 'error']),
  metadata: z.record(z.any()).optional(),
});

class LogService {
  async getListLogs() {
    return await LogRepository.findAll();
  }

  async addLog(data) {
    const parsed = logEntrySchema.safeParse(data);
    if (!parsed.success) {
      throw { status: 400, message: parsed.error.errors };
    }

    const newLog = await LogRepository.create(parsed.data);
    return { message: "Thêm log thành công", log: newLog };
  }
}

module.exports = new LogService();