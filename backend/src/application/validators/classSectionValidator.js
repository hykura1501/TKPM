const { z } = require('zod');

const classSectionSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Mã lớp không được để trống'),
  courseId: z.string({ required_error: 'Vui lòng chọn khóa học' }),
  academicYear: z.string().min(4, { message: 'Vui lòng nhập năm học' }),
  semester: z.string({ required_error: 'Vui lòng chọn học kỳ' }),
  currentEnrollment: z.number().optional(),
  instructor: z.string().min(3, { message: 'Tên giảng viên phải có ít nhất 3 ký tự' }),
  maxCapacity: z.number().min(1, { message: 'Sĩ số tối đa phải lớn hơn 0' }).max(100, { message: 'Sĩ số tối đa không được vượt quá 100' }),
  schedule: z.string().min(3, { message: 'Vui lòng nhập lịch học' }),
  classroom: z.string().min(1, { message: 'Vui lòng nhập phòng học' }),
});

module.exports = { classSectionSchema };
