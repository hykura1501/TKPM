const GetClassSectionByCourseIdUseCase = require('../../../src/application/usecases/classSection/GetClassSectionByCourseIdUseCase');

describe('GetClassSectionByCourseIdUseCase', () => {
  let classSectionRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findAllByCondition: jest.fn()
    };
    useCase = new GetClassSectionByCourseIdUseCase({ classSectionRepository });
  });

  it('should throw error if no class sections found', async () => {
    classSectionRepository.findAllByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should return class sections if found', async () => {
    classSectionRepository.findAllByCondition.mockResolvedValue([{ id: 1, courseId: 1 }]);
    const result = await useCase.execute(1);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('courseId', 1);
  });
});
