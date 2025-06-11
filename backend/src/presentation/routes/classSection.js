const express = require('express');
const router = express.Router();
const container = require('../../container');
const classSectionController = container.resolve('classSectionController');

router.get('/', (...args) => classSectionController.getListClassSections(...args));
router.post('/', (...args) => classSectionController.createClassSection(...args));
router.put('/', (...args) => classSectionController.updateClassSection(...args));
router.delete('/:id', (...args) => classSectionController.deleteClassSection(...args));
router.get('/course/:courseId', (...args) => classSectionController.getClassSectionByCourseId(...args));

module.exports = router;
