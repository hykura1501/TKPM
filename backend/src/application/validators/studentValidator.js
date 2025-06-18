// application/validators/studentValidator.js
// (Bạn có thể mở rộng thêm các schema validate cho student ở đây)
const z = require('zod');

const identityDocumentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CMND"),
    number: z.string().min(9, { message: "Số CMND phải có ít nhất 9 số" }),
    issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
    issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
    expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
  }),
  z.object({
    type: z.literal("CCCD"),
    number: z.string().min(12, { message: "Số CCCD phải có ít nhất 12 số" }),
    issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
    issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
    expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
    hasChip: z.boolean(),
  }),
  z.object({
    type: z.literal("Passport"),
    number: z.string().min(8, { message: "Số hộ chiếu phải có ít nhất 8 ký tự" }),
    issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
    issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
    expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
    issuingCountry: z.string().min(1, { message: "Vui lòng nhập quốc gia cấp" }),
    notes: z.string().optional(),
  }),
]);

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
  temporaryAddress: z.object({
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
  identityDocument: identityDocumentSchema.optional(),
  nationality: z.string().optional(),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

module.exports = { studentSchema };
