const express = require('express');
const router = express.Router();
const container = require('../../container');
const registrationController = container.resolve('registrationController');

router.get('/', (...args) => registrationController.getListRegistrations(...args));
router.post('/', (...args) => registrationController.addRegistration(...args));
router.put('/', (...args) => registrationController.updateRegistration(...args));
router.delete('/:id', (...args) => registrationController.deleteRegistration(...args));
router.patch('/:id/cancel', (...args) => registrationController.cancelRegistration(...args));
router.get('/grade/:classId', (...args) => registrationController.getGradeByClassId(...args));
router.post('/grade/:classId', (...args) => registrationController.saveGradeByClassId(...args));

module.exports = router;
