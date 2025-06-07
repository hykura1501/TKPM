const { z } = require('zod');

const programSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Tên chương trình học không được để trống' }),
  faculty: z.string().min(1, { message: 'Khoa không được để trống' }),
});

module.exports = { programSchema };
