const express = require ('express');
const router =express.Router();
const ClassSectionController = require('../controllers/ClassSectionController');

router.get('/', ClassSectionController.getListClassSections);
router.post('/', ClassSectionController.addClassSection);
router.put('/', ClassSectionController.updateClassSection);
router.delete('/:id', ClassSectionController.deleteClassSection);
router.get('/course/:courseId', ClassSectionController.getClassSectionByCourseId);

module.exports = router;