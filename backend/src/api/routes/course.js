const express = require ('express');
const router =express.Router();
const CourseController = require('../controllers/CourseController');

router.get('/', CourseController.getListCourses);
router.post('/', CourseController.addCourse);
router.put('/', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);
router.get('/:id/translation', CourseController.getTranslationCourse);
router.put('/:id/translation', CourseController.updateTranslationCourse);

module.exports = router;