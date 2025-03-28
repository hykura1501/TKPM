const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/StatusController');

router.get('/', StatusController.getListStatuses);
router.post('/', StatusController.addStatus);
router.put('/', StatusController.updateStatus);
router.delete('/:id', StatusController.deleteStatus);
router.patch('/rules', StatusController.updateStatusRules);
router.get('/rules', StatusController.getStatusRules);

module.exports = router;