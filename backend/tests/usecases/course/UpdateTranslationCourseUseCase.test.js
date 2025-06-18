const UpdateTranslationCourseUseCase = require('../../../src/application/usecases/course/UpdateTranslationCourseUseCase');

describe('UpdateTranslationCourseUseCase', () => {
  let courseRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateTranslationCourseUseCase({ courseRepository: courseRepositoryMock });
  });

  it('should throw error if courseId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1, {})).rejects.toHaveProperty('status', 404);
  });

  it('should update translations successfully', async () => {
    const course = {
      id: 1,
      name: new Map([['vi', 'Tên']]),
      description: new Map([['vi', 'Mô tả']]),
    };
    courseRepositoryMock.findOneByCondition.mockResolvedValue(course);
    courseRepositoryMock.update.mockResolvedValue({ id: 1 });
    const translations = {
      vi: { courseName: 'Tên mới', description: 'Mô tả mới' },
      en: { courseName: 'New Name', description: 'New Desc' },
    };
    const result = await useCase.execute(1, translations);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(courseRepositoryMock.update).toHaveBeenCalled();
  });
});
