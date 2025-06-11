const express = require('express');
const router = express.Router();
const container = require('../../container');
const statusController = container.resolve('statusController');

router.get('/', (...args) => statusController.getListStatuses(...args));
router.post('/', (...args) => statusController.createStatus(...args));
router.put('/', (...args) => statusController.updateStatus(...args));
router.delete('/:id', (...args) => statusController.deleteStatus(...args));
router.patch('/rules', (...args) => statusController.updateStatusRules(...args));
router.get('/rules', (...args) => statusController.getStatusRules(...args));
router.get('/:id/translation', (...args) => statusController.getTranslationStatus(...args));
router.put('/:id/translation', (...args) => statusController.updateTranslationStatus(...args));

module.exports = router;
