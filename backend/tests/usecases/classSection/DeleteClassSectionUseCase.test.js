const DeleteClassSectionUseCase = require('../../../src/application/usecases/classSection/DeleteClassSectionUseCase');

describe('DeleteClassSectionUseCase', () => {
  let classSectionRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findOneByCondition: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };
    useCase = new DeleteClassSectionUseCase({ classSectionRepository });
  });

  it('should throw error if id is empty', async () => {
    await expect(useCase.execute(null)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class section does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should throw error if class section is in use', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue({ id: 1, currentEnrollment: 5 });
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 400);
  });

  it('should delete class section successfully', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValue({ id: 1, currentEnrollment: 0 });
    classSectionRepository.delete.mockResolvedValue();
    classSectionRepository.findAll.mockResolvedValue([]);
    const result = await useCase.execute(1);
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result.classSections).toBeInstanceOf(Array);
  });
});
