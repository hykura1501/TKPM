// presentation/routes/student.js
const express = require('express');
const router = express.Router();

const container = require('../../container');
const studentController = container.resolve('studentController');

router.get('/', (...args) => studentController.getListStudents(...args));
router.get('/:mssv', (...args) => studentController.getStudentById(...args));
router.post('/', (...args) => studentController.createStudent(...args));
router.put('/:mssv', (...args) => studentController.updateStudent(...args));
router.delete('/:mssv', (...args) => studentController.deleteStudent(...args));
// Các route mở rộng khác nếu cần

module.exports = router;
