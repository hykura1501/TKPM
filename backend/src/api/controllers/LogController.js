const Log = require('../models/Log');
const { z } = require('zod');

// Define the schema for input validation
const logEntrySchema = z.object({
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

class LogController {
  async getListLogs(req, res) {
    try {
      const logs = await Log.find({});
      res.status(200).json(logs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách log:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách log" });
    }
  }

  async addLog(req, res) {
    try {
      const parsed = logEntrySchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }

      const newLog = new Log(parsed.data);
      await newLog.save();
      res.status(201).json({ message: "Thêm log thành công", log: newLog });
    } catch (error) {
      console.error("Lỗi khi thêm log:", error);
      res.status(500).json({ error: "Lỗi khi thêm log" });
    }
  }
}

module.exports = new LogController();