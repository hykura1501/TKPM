const express = require ('express');
const router =express.Router();
const FacultyController = require('../controllers/FacultyController');

router.get('/', FacultyController.getListFaculties);
router.post('/', FacultyController.addFaculty);
router.put('/', FacultyController.updateFaculty);
router.delete('/:id', FacultyController.deleteFaculty);
router.get('/:id/translation', FacultyController.getTranslationFaculty);
router.put('/:id/translation', FacultyController.updateTranslationFaculty);

module.exports = router;