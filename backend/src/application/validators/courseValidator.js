const { z } = require('zod');

const courseSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3, { message: 'Mã khóa học phải có ít nhất 3 ký tự' }),
  name: z.string().min(3, { message: 'Tên khóa học phải có ít nhất 3 ký tự' }),
  credits: z.number().min(2, { message: 'Số tín chỉ phải lớn hơn hoặc bằng 2' }).max(10, { message: 'Số tín chỉ không được vượt quá 10' }),
  faculty: z.string({ required_error: 'Vui lòng chọn khoa phụ trách' }),
  description: z.string().min(10, { message: 'Mô tả phải có ít nhất 10 ký tự' }),
  prerequisites: z.array(z.string()).default([]),
});

module.exports = { courseSchema };
