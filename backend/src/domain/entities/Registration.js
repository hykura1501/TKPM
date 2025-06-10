const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    id: { type : String, required: true, unique: true },
    studentId: { type: String, required: true },
    classSectionId: { type: String, required: true },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    grade: { type: Number, default: null }, // Optional grade
    registeredAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date, default: null }, // Optional cancellation date
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model("Registration", RegistrationSchema);