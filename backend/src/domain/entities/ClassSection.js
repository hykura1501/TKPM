const mongoose = require('mongoose');

const ClassSectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  instructor: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  currentEnrollment: { type: Number, required: true },
  schedule: { type: String, required: true },
  classroom: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ClassSection = mongoose.model('ClassSection', ClassSectionSchema);
module.exports = ClassSection;
