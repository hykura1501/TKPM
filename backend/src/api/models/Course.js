const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: Map,
      of: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
    },
    faculty: {
      type: String,
      required: true,
    },
    description: {
      type: Map,
      of: String,
    },
    prerequisites: {
      type: [String], // Array of course codes
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model("Course", CourseSchema);