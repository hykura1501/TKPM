const ClassSectionExistsUseCase = require('../../../src/application/usecases/classSection/ClassSectionExistsUseCase');

describe('ClassSectionExistsUseCase', () => {
  let classSectionRepository;
  let useCase;

  beforeEach(() => {
    classSectionRepository = {
      findOneByCondition: jest.fn()
    };
    useCase = new ClassSectionExistsUseCase({ classSectionRepository });
  });

  it('should return true if class section exists', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue({ id: 1 });
    const result = await useCase.execute(1);
    expect(result).toBe(true);
  });

  it('should return false if class section does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue(null);
    const result = await useCase.execute(2);
    expect(result).toBe(false);
  });
});
