const CourseController = require('../../src/api/controllers/CourseController');
const CourseService = require('../../src/api/services/CourseService');

jest.mock('../../src/api/services/CourseService');

describe('CourseController', () => {
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

  describe('getListCourses', () => {
    it('should return list successfully', async () => {
      const fakeData = [{ id: 1, name: 'Course A' }];
      CourseService.getListCourses.mockResolvedValue(fakeData);

      await CourseController.getListCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    it('should handle error', async () => {
      CourseService.getListCourses.mockRejectedValue(new Error('Error fetching'));

      await CourseController.getListCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('addCourse', () => {
    it('should add successfully', async () => {
      const fakeResult = { success: true };
      CourseService.addCourse.mockResolvedValue(fakeResult);
      req.body = { name: 'Course B' };

      await CourseController.addCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('should handle error when adding', async () => {
      const error = new Error('Add failed');
      error.status = 400;
      CourseService.addCourse.mockRejectedValue(error);

      await CourseController.addCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
    });
  });
});