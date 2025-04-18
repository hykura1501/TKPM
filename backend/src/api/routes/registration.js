const express = require ('express');
const router =express.Router();
const RegistrationController = require('../controllers/RegistrationController');

router.get('/', RegistrationController.getListRegistrations);
router.post('/', RegistrationController.addRegistration);
router.put('/', RegistrationController.updateRegistration);
router.delete('/:id', RegistrationController.deleteRegistration);
router.patch('/:id/cancel', RegistrationController.cancelRegistration);
router.get('/grade/:classId', RegistrationController.getGradeByClassId); 
router.post('/grade/:classId', RegistrationController.saveGradeByClassId);
module.exports = router;