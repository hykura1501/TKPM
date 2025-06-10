const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  }
);

module.exports = mongoose.model("Semester", SemesterSchema);