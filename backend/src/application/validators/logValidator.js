// application/validators/studentValidator.js
// (Bạn có thể mở rộng thêm các schema validate cho student ở đây)
const z = require('zod');


const logEntrySchema = z.object({
  timestamp: z.string().min(1, { message: "Timestamp is required" }),
  message: z.string().min(1, { message: "Message is required" }), 
  level: z.enum(['info', 'warn', 'error']), 
  metadata: z.record(z.any()).optional(), 
});

module.exports = { logEntrySchema };
