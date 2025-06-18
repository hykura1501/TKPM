const GetClassSectionListUseCase = require('../../../src/application/usecases/classSection/GetClassSectionListUseCase');

describe('GetClassSectionListUseCase', () => {
  let classSectionRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findAll: jest.fn()
    };
    useCase = new GetClassSectionListUseCase({ classSectionRepository });
  });

  it('should return all class sections', async () => {
    classSectionRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await useCase.execute();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
  });
});
