const express = require ('express');
const router =express.Router();
const RegistrationController = require('../controllers/RegistrationController');

router.get('/', RegistrationController.getListRegistrations);
router.post('/', RegistrationController.addRegistration);
router.put('/', RegistrationController.updateRegistration);
router.delete('/:id', RegistrationController.deleteRegistration);

module.exports = router;