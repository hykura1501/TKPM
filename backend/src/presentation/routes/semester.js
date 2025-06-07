const express = require('express');
const router = express.Router();
const container = require('../../container');
const semesterController = container.resolve('semesterController');

router.get('/', (...args) => semesterController.getListSemesters(...args));
// Thêm các route khác tương ứng với controller mới nếu đã refactor

module.exports = router;
