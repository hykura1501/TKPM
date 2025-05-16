const FacultyController = require('../../src/api/controllers/FacultyController');
const FacultyService = require('../../src/api/services/FacultyService');

jest.mock('../../src/api/services/FacultyService');

describe('FacultyController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      language: 'vi',
      query: { lang: 'en' },
      body: {},
      params: { id: '123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getListFaculties', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Công nghệ thông tin' }];
      FacultyService.getListFaculties.mockResolvedValue(fakeData);

      await FacultyController.getListFaculties(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      FacultyService.getListFaculties.mockRejectedValue(new Error('Something went wrong'));

      await FacultyController.getListFaculties(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách khoa' });
    });
  });

  describe('addFaculty', () => {
    it('should add successfully', async () => {
      const newFaculty = { name: 'Khoa học máy tính' };
      req.body = newFaculty;
      const result = { id: 1, ...newFaculty };

      FacultyService.addFaculty.mockResolvedValue(result);

      await FacultyController.addFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(result);
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
