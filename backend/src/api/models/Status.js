const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String }
});

module.exports = mongoose.model('Status', StatusSchema,'statuses');

