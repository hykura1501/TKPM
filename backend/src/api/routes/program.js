const express = require('express');
const router = express.Router();
const ProgramController = require('../controllers/ProgramController');

router.get('/', ProgramController.getListPrograms);
router.post('/', ProgramController.addProgram);
router.put('/', ProgramController.updateProgram);
router.delete('/:id', ProgramController.deleteProgram);

module.exports = router;