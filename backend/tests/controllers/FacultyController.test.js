const FacultyController = require('../../src/api/controllers/FacultyController');
const FacultyService = require('../../src/api/services/FacultyService');

jest.mock('../../src/api/services/FacultyService');

describe('FacultyController', () => {
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

  describe('getListFaculties', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Faculty A' }];
      FacultyService.getListFaculties.mockResolvedValue(fakeData);

      await FacultyController.getListFaculties(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      FacultyService.getListFaculties.mockRejectedValue(new Error('Error fetching'));

      await FacultyController.getListFaculties(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addFaculty', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      FacultyService.addFaculty.mockResolvedValue(fakeResult);
      req.body = { name: 'Faculty B' };

      await FacultyController.addFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      FacultyService.addFaculty.mockRejectedValue(error);

      await FacultyController.addFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});