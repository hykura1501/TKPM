const { z } = require('zod');

const registrationSchema = z.object({
  id: z.string().optional(),
  studentId: z.string({ required_error: 'Vui lòng chọn sinh viên' }),
  classSectionId: z.string({ required_error: 'Vui lòng chọn lớp học' }),
  status: z.enum(['active', 'cancelled'], { required_error: 'Vui lòng chọn trạng thái' }),
  grade: z.number().optional(),
});

module.exports = { registrationSchema };
