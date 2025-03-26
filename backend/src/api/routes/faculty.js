const express = require ('express');
const router =express.Router();
const FacultyController = require('../controllers/FacultyController');

router.get('/', FacultyController.getListFaculties);
router.post('/', FacultyController.addFaculty);
router.put('/', FacultyController.updateFaculty);
router.delete('/:id', FacultyController.deleteFaculty);

module.exports = router;