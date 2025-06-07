// presentation/routes/faculty.js
const express = require('express');
const router = express.Router();
const container = require('../../container');
const facultyController = container.resolve('facultyController');

router.get('/', (...args) => facultyController.getListFaculties(...args));
router.get('/:id', (...args) => facultyController.getFacultyById(...args));
router.post('/', (...args) => facultyController.createFaculty(...args));
router.put('/:id', (...args) => facultyController.updateFaculty(...args));
router.delete('/:id', (...args) => facultyController.deleteFaculty(...args));
// Các route mở rộng cho translation nếu cần
// router.get('/:id/translation', (...args) => facultyController.getTranslationFaculty(...args));
// router.put('/:id/translation', (...args) => facultyController.updateTranslationFaculty(...args));

module.exports = router;

