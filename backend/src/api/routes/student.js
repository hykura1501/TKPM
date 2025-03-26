const express = require ('express');
const router =express.Router();

const studentController= require('../controllers/StudentController');

router.get('/',studentController.getListStudents);
router.post('/',studentController.addStudent);
router.put('/',studentController.updateStudent);
router.delete('/:mssv',studentController.deleteStudent);

module.exports = router;