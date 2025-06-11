const express = require('express');
const router = express.Router();
const container = require('../../container');
const settingController = container.resolve('settingController');

router.get('/', (...args) => settingController.getAllSettings(...args));
router.patch('/domains', (...args) => settingController.updateDomains(...args));
router.get('/domains', (...args) => settingController.getDomains(...args));
router.patch('/phone', (...args) => settingController.updatePhoneFormats(...args));
router.get('/status/rules', (...args) => settingController.getStatusRules(...args));

module.exports = router;
