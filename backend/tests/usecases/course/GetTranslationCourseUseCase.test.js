const GetTranslationCourseUseCase = require('../../../src/application/usecases/course/GetTranslationCourseUseCase');

describe('GetTranslationCourseUseCase', () => {
  let courseRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetTranslationCourseUseCase({ courseRepository: courseRepositoryMock });
  });

  it('should throw error if courseId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should return translations if course exists', async () => {
    const course = {
      id: 1,
      name: new Map([['vi', 'Tên'], ['en', 'Name']]),
      description: new Map([['vi', 'Mô tả'], ['en', 'Description']]),
    };
    courseRepositoryMock.findOneByCondition.mockResolvedValue(course);
    const result = await useCase.execute(1);
    expect(result.vi).toBeDefined();
    expect(result.en).toBeDefined();
  });
});
