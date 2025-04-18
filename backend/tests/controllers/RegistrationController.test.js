const RegistrationController = require('../../src/api/controllers/RegistrationController');
const RegistrationService = require('../../src/api/services/RegistrationService');

jest.mock('../../src/api/services/RegistrationService');

describe('RegistrationController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListRegistrations', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Registration A' }];
      RegistrationService.getListRegistrations.mockResolvedValue(fakeData);

      await RegistrationController.getListRegistrations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      RegistrationService.getListRegistrations.mockRejectedValue(new Error('Error fetching'));

      await RegistrationController.getListRegistrations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addRegistration', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      RegistrationService.addRegistration.mockResolvedValue(fakeResult);
      req.body = { name: 'Registration B' };

      await RegistrationController.addRegistration(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      RegistrationService.addRegistration.mockRejectedValue(error);

      await RegistrationController.addRegistration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});