const { z } = require('zod');

const facultySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Tên khoa phải có ít nhất 3 ký tự' }),
});

module.exports = { facultySchema };
