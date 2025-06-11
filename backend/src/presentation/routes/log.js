const express = require('express');
const router = express.Router();
const container = require('../../container');
const logController = container.resolve('logController');

router.get('/', (...args) => logController.getListLogs(...args));
router.post('/', (...args) => logController.addLog(...args));

module.exports = router;
