const ProgramController = require('../../src/api/controllers/ProgramController');
const ProgramService = require('../../src/api/services/ProgramService');

jest.mock('../../src/api/services/ProgramService');

describe('ProgramController', () => {
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

  describe('getListPrograms', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Program A' }];
      ProgramService.getListPrograms.mockResolvedValue(fakeData);

      await ProgramController.getListPrograms(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      ProgramService.getListPrograms.mockRejectedValue(new Error('Error fetching'));

      await ProgramController.getListPrograms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addProgram', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      ProgramService.addProgram.mockResolvedValue(fakeResult);
      req.body = { name: 'Program B' };

      await ProgramController.addProgram(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      ProgramService.addProgram.mockRejectedValue(error);

      await ProgramController.addProgram(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});