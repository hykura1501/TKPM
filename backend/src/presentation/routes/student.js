// presentation/routes/student.js
const express = require('express');
const router = express.Router();

const container = require('../../container');
const studentController = container.resolve('studentController');

router.get('/', (...args) => studentController.getListStudents(...args));
router.post('/', (...args) => studentController.createStudent(...args));
router.put('/', (...args) => studentController.updateStudent(...args));
router.delete('/:mssv', (...args) => studentController.deleteStudent(...args));
router.post('/import', (...args) => studentController.addStudentFromFile(...args));
router.get('/grades/:studentId', (...args) => studentController.getGradeByStudentId(...args));
router.get('/export', (...args) => studentController.exportStudentList(...args));

module.exports = router;
