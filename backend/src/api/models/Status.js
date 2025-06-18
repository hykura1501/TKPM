const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: Map, of: String, required: true },
  color: { type: String },
  allowedStatus: [{ type: String, required: true }]
});

module.exports = mongoose.model('Status', StatusSchema, 'statuses');

