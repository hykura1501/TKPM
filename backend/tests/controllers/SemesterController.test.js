const SemesterController = require('../../src/api/controllers/SemesterController');
const SemesterService = require('../../src/api/services/SemesterService');

jest.mock('../../src/api/services/SemesterService');

describe('SemesterController', () => {
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

  describe('getListSemesters', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Semester A' }];
      SemesterService.getListSemesters.mockResolvedValue(fakeData);

      await SemesterController.getListSemesters(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      SemesterService.getListSemesters.mockRejectedValue(new Error('Error fetching'));

      await SemesterController.getListSemesters(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addSemester', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      SemesterService.addSemester.mockResolvedValue(fakeResult);
      req.body = { name: 'Semester B' };

      await SemesterController.addSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      SemesterService.addSemester.mockRejectedValue(error);

      await SemesterController.addSemester(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});