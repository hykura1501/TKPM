const GetProgramByIdUseCase = require('../../../src/application/usecases/program/GetProgramByIdUseCase');

describe('GetProgramByIdUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetProgramByIdUseCase({ programRepository: programRepositoryMock });
  });

  it('should return program if found', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'program-1', name: new Map([['vi', 'Chương trình 1']]) });
    const result = await useCase.execute('program-1');
    expect(result).toBeDefined();
    expect(result.id).toBe('program-1');
  });

  it('should return null if not found', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const result = await useCase.execute('program-999');
    expect(result).toBeNull();
  });
});
