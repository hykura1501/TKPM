const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    allowDomains: { type: [String], required: true },
    allowPhones: [{
        countryCode: { type: String, required: true },
        countryName: { type: String, required: true },
        prefix: { type: String, required: true },
        example: { type: String, required: true }
    }]
});

module.exports = mongoose.model('Settings', SettingsSchema, 'settings');
