const CreateCourseUseCase = require('../../../src/application/usecases/course/CreateCourseUseCase');

describe('CreateCourseUseCase', () => {
  let courseRepositoryMock, facultyRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
      getNextId: jest.fn(),
      create: jest.fn(),
    };
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new CreateCourseUseCase({ courseRepository: courseRepositoryMock });
    useCase.facultyRepository = facultyRepositoryMock;
  });

  it('should throw error if course is invalid', async () => {
    const invalidCourse = {};
    await expect(useCase.execute(invalidCourse)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course code already exists', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValueOnce({ id: 1 });
    const course = { code: 'CSE101', name: 'Course', faculty: 1 };
    await expect(useCase.execute(course)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course name already exists', async () => {
    courseRepositoryMock.findOneByCondition
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 2 });
    const course = { code: 'CSE101', name: 'Course', faculty: 1 };
    await expect(useCase.execute(course)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const course = { code: 'CSE101', name: 'Course', faculty: 1 };
    await expect(useCase.execute(course)).rejects.toHaveProperty('status', 400);
  });

  it('should create course successfully', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 1 });
    courseRepositoryMock.getNextId.mockResolvedValue(10);
    courseRepositoryMock.create.mockResolvedValue({ id: 10 });
    const course = { code: 'CSE101', name: 'Course', faculty: 1 };
    await expect(useCase.execute(course)).resolves.toBeDefined();
  });
});
