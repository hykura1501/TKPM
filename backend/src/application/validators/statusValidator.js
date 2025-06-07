const { z } = require('zod');

const statusSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Tên không được để trống' }),
  color: z.string(),
  allowedStatus: z.array(z.string()).optional(),
});

module.exports = { statusSchema };
