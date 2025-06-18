const UpdateCourseUseCase = require('../../../src/application/usecases/course/UpdateCourseUseCase');

describe('UpdateCourseUseCase', () => {
  let courseRepositoryMock, facultyRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new UpdateCourseUseCase({ courseRepository: courseRepositoryMock });
    useCase.facultyRepository = facultyRepositoryMock;
  });

  it('should throw error if course is invalid', async () => {
    const invalidCourse = {};
    await expect(useCase.execute(invalidCourse)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValueOnce(null);
    facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'faculty-1' });
    const course = {
      id: 'course-999',
      code: 'FAKE001',
      name: 'Khóa học không tồn tại',
      credits: 2,
      faculty: 'faculty-1',
      description: 'Mô tả',
      prerequisites: []
    };
    await expect(useCase.execute(course)).rejects.toHaveProperty('status', 404);
  });

  it('should update course successfully', async () => {
    courseRepositoryMock.findOneByCondition
      .mockResolvedValueOnce(null) // for code check
      .mockResolvedValueOnce(null) // for name check
      .mockResolvedValueOnce({ // for id check (course exists)
        id: 'course-5',
        code: 'NN001',
        name: new Map(Object.entries({ vi: 'Tiếng Anh cơ bản', en: 'Basic English' })),
        credits: 2,
        faculty: 'faculty-1',
        description: new Map(Object.entries({ vi: 'Khóa học tiếng Anh cơ bản cho sinh viên năm nhất', en: 'Basic English course for first-year students.' })),
        prerequisites: [],
        isActive: true,
        createdAt: '2023-01-05T00:00:00+00:00',
        updatedAt: '2025-06-17T09:19:55.697Z',
      });
    facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'faculty-1' });
    courseRepositoryMock.update.mockResolvedValue({ id: 'course-5' });
    const course = {
      id: 'course-5',
      code: 'NN001',
      name: 'Tiếng Anh cơ bản',
      credits: 2,
      faculty: 'faculty-1',
      description: 'Khóa học tiếng Anh cơ bản cho sinh viên năm nhất',
      prerequisites: []
    };
    await expect(useCase.execute(course)).resolves.toBeDefined();
  });
});
