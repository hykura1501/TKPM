const UpdateTranslationProgramUseCase = require('../../../src/application/usecases/program/UpdateTranslationProgramUseCase');

describe('UpdateTranslationProgramUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateTranslationProgramUseCase({ programRepository: programRepositoryMock });
  });

  it('should throw error if programId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if program does not exist', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('program-1', {})).rejects.toHaveProperty('status', 404);
  });

  it('should update translations successfully', async () => {
    const program = {
      id: 'program-1',
      name: new Map([['vi', 'Chương trình 1']]),
    };
    programRepositoryMock.findOneByCondition.mockResolvedValue(program);
    programRepositoryMock.update.mockResolvedValue({ id: 'program-1' });
    const translations = {
      vi: { programName: 'Chương trình 1 mới' },
      en: { programName: 'New Program 1' },
    };
    const result = await useCase.execute('program-1', translations);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(programRepositoryMock.update).toHaveBeenCalled();
  });
});
