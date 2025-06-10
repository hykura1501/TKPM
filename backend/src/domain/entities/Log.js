const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  level: { type: String, required: true },
  message: { type: String, required: true },
  metadata: {
    id: { type: String },
    timestamp: { type: String },
    action: { type: String },
    entity: { type: String },
    user: { type: String },
    details: { type: String }
  }
});

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);
module.exports = Log;
