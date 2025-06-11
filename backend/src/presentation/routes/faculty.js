// presentation/routes/faculty.js
const express = require('express');
const router = express.Router();
const container = require('../../container');
const facultyController = container.resolve('facultyController');

router.get('/', (...args) => facultyController.getListFaculties(...args));
router.post('/', (...args) => facultyController.createFaculty(...args));
router.put('/', (...args) => facultyController.updateFaculty(...args));
router.delete('/:id', (...args) => facultyController.deleteFaculty(...args));
router.get('/:id/translation', (...args) => facultyController.getTranslationFaculty(...args));
router.put('/:id/translation', (...args) => facultyController.updateTranslationFaculty(...args));

module.exports = router;

