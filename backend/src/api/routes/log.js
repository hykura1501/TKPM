const express = require('express');
const router = express.Router();
const LogController = require('../controllers/LogController');

router.get('/', LogController.getListLogs);
router.post('/', LogController.addLog);

module.exports = router;