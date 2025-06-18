const GetTranslationProgramByIdUseCase = require('../../../src/application/usecases/program/GetTranslationProgramByIdUseCase');

describe('GetTranslationProgramByIdUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetTranslationProgramByIdUseCase({ programRepository: programRepositoryMock });
  });

  it('should throw error if programId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if program does not exist', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('program-1')).rejects.toHaveProperty('status', 404);
  });

  it('should return translations if program exists', async () => {
    const program = {
      id: 'program-1',
      name: new Map([['vi', 'Chương trình 1'], ['en', 'Program 1']]),
    };
    programRepositoryMock.findOneByCondition.mockResolvedValue(program);
    const result = await useCase.execute('program-1');
    expect(result.vi).toBeDefined();
    expect(result.en).toBeDefined();
  });
});
