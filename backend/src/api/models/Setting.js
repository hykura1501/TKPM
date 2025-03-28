const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    allowDomains: { type: Array, required: true },
    allowPhones: { type: Array, required: true },
});

module.exports = mongoose.model('Settings', SettingsSchema, 'settings');
