// application/validators/studentValidator.js
// (Bạn có thể mở rộng thêm các schema validate cho student ở đây)
const z = require('zod');

const studentSchema = z.object({
  mssv: z.string().optional(),
  fullName: z.string().min(3, 'Họ tên không hợp lệ'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  faculty: z.string().optional(),
  course: z.string().optional(),
  program: z.string().optional(),
  permanentAddress: z.object({
    streetAddress: z.string().optional(),
    ward: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  mailingAddress: z.object({
    streetAddress: z.string().optional(),
    ward: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  identityDocument: z.object({
    type: z.string().optional(),
    number: z.string().optional(),
    issueDate: z.string().optional(),
    issuePlace: z.string().optional(),
    expiryDate: z.string().optional(),
    hasChip: z.boolean().optional(),
  }).optional(),
  nationality: z.string().optional(),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

module.exports = { studentSchema };
