const express = require('express');
const router = express.Router();
const container = require('../../container');
const programController = container.resolve('programController');

router.get('/', (...args) => programController.getListPrograms(...args));
router.post('/', (...args) => programController.addProgram(...args));
router.put('/', (...args) => programController.updateProgram(...args));
router.delete('/:id', (...args) => programController.deleteProgram(...args));
router.get('/:id/translation', (...args) => programController.getTranslationProgram(...args));
router.put('/:id/translation', (...args) => programController.updateTranslationProgram(...args));

module.exports = router;
