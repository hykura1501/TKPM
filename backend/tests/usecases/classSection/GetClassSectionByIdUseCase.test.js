const GetClassSectionByIdUseCase = require('../../../src/application/usecases/classSection/GetClassSectionByIdUseCase');

describe('GetClassSectionByIdUseCase', () => {
  let classSectionRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findOneByCondition: jest.fn()
    };
    useCase = new GetClassSectionByIdUseCase({ classSectionRepository });
  });

  it('should throw error if class section not found', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should return class section if found', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue({ id: 1 });
    const result = await useCase.execute(1);
    expect(result).toHaveProperty('id', 1);
  });
});
