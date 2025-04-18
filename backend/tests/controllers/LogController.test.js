const LogController = require('../../src/api/controllers/LogController');
const LogService = require('../../src/api/services/LogService');

jest.mock('../../src/api/services/LogService');

describe('LogController', () => {
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

  describe('getListLogs', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Log A' }];
      LogService.getListLogs.mockResolvedValue(fakeData);

      await LogController.getListLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      LogService.getListLogs.mockRejectedValue(new Error('Error fetching'));

      await LogController.getListLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addLog', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      LogService.addLog.mockResolvedValue(fakeResult);
      req.body = { name: 'Log B' };

      await LogController.addLog(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      LogService.addLog.mockRejectedValue(error);

      await LogController.addLog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});