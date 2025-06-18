const UpdateClassSectionUseCase = require('../../../src/application/usecases/classSection/UpdateClassSectionUseCase');

describe('UpdateClassSectionUseCase', () => {
  let classSectionRepository, courseRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn()
    };
    courseRepository = {
      findOneByCondition: jest.fn()
    };
    useCase = new UpdateClassSectionUseCase({ classSectionRepository, courseRepository });
  });

  it('should throw error if input is invalid', async () => {
    const data = { id: '', code: '', courseId: '' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class section does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce(null);
    const data = { id: 1, code: 'A', courseId: 1 };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 404);
  });

  it('should throw error if course does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce({ id: 1 });
    courseRepository.findOneByCondition.mockResolvedValueOnce(null);
    const data = { id: 1, code: 'A', courseId: 2 };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should update class section successfully', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce({ id: 1 });
    courseRepository.findOneByCondition.mockResolvedValueOnce({ id: 2 });
    classSectionRepository.update.mockResolvedValue();
    classSectionRepository.findAll.mockResolvedValue([{ id: 1, code: 'A', courseId: 2 }]);
    const data = { id: 1, code: 'A', courseId: 2 };
    const result = await useCase.execute(data);
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result.classSections).toBeInstanceOf(Array);
  });
});
