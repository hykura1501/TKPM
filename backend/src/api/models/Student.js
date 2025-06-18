const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  mssv: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String },
  gender: { type: String },
  faculty: { type: String },
  course: { type: String },
  program: { type: String },
  permanentAddress: {
    streetAddress: { type: String },
    ward: { type: String },
    district: { type: String },
    province: { type: String },
    country: { type: String }
  },
  mailingAddress: {
    streetAddress: { type: String },
    ward: { type: String },
    district: { type: String },
    province: { type: String },
    country: { type: String }
  },
  identityDocument: {
    type: { type: String },
    number: { type: String },
    issueDate: { type: String },
    issuePlace: { type: String },
    expiryDate: { type: String },
    hasChip: { type: Boolean }
  },
  nationality: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
