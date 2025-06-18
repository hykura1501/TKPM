const CreateProgramUseCase = require('../../../src/application/usecases/program/CreateProgramUseCase');

describe('CreateProgramUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      getNextId: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateProgramUseCase({ programRepository: programRepositoryMock });
  });

  it('should throw error if program is invalid', async () => {
    const invalidProgram = {};
    await expect(useCase.execute(invalidProgram)).rejects.toHaveProperty('status', 400);
  });

  it('should create program successfully', async () => {
    programRepositoryMock.getNextId.mockResolvedValue('program-1');
    programRepositoryMock.create.mockResolvedValue({ id: 'program-1' });
    programRepositoryMock.findAll.mockResolvedValue([
      { id: 'program-1', name: new Map([['vi', 'Chương trình 1'], ['en', 'Program 1']]), faculty: 'faculty-1' }
    ]);
    const program = { name: 'Chương trình 1', faculty: 'faculty-1' };
    const result = await useCase.execute(program, 'vi');
    expect(result.message).toMatch(/thành công/);
  });
});
