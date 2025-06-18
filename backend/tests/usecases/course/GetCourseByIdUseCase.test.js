const GetCourseByIdUseCase = require('../../../src/application/usecases/course/GetCourseByIdUseCase');

describe('GetCourseByIdUseCase', () => {
  let courseRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetCourseByIdUseCase({ courseRepository: courseRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should return formatted course if found', async () => {
    const course = { id: 1, name: new Map(), description: new Map() };
    courseRepositoryMock.findOneByCondition.mockResolvedValue(course);
    const result = await useCase.execute(1);
    expect(result).toBeDefined();
  });
});
