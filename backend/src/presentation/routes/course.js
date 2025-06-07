const express = require('express');
const router = express.Router();
const container = require('../../container');
const courseController = container.resolve('courseController');

router.get('/', (...args) => courseController.getListCourses(...args));
router.post('/', (...args) => courseController.addCourse(...args));
router.put('/', (...args) => courseController.updateCourse(...args));
router.delete('/:id', (...args) => courseController.deleteCourse(...args));
router.get('/:id/translation', (...args) => courseController.getTranslationCourse(...args));
router.put('/:id/translation', (...args) => courseController.updateTranslationCourse(...args));

module.exports = router;
