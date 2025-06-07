const { z } = require('zod');
const { SUPPORTED_LOCALES } = require('../../configs/locales');

const facultySchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2, { message: 'Mã khoa phải có ít nhất 2 ký tự' }),
  name: z.string().min(3, { message: 'Tên khoa phải có ít nhất 3 ký tự' }),
  description: z.string().min(10, { message: 'Mô tả phải có ít nhất 10 ký tự' }),
});

module.exports = { facultySchema };
