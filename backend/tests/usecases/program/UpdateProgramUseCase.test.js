const UpdateProgramUseCase = require('../../../src/application/usecases/program/UpdateProgramUseCase');

describe('UpdateProgramUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new UpdateProgramUseCase({ programRepository: programRepositoryMock });
  });

  it('should throw error if program is invalid', async () => {
    const invalidProgram = {};
    await expect(useCase.execute(invalidProgram)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if program does not exist', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const program = { id: 'program-999', name: 'Không tồn tại', faculty: 'faculty-1' };
    await expect(useCase.execute(program)).rejects.toHaveProperty('status', 404);
  });

  it('should update program successfully', async () => {
    programRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'program-1', name: new Map([['vi', 'Chương trình 1']]), faculty: 'faculty-1' });
    programRepositoryMock.update.mockResolvedValue({ id: 'program-1' });
    programRepositoryMock.findAll.mockResolvedValue([{ id: 'program-1', name: new Map([['vi', 'Chương trình 1']]), faculty: 'faculty-1' }]);
    const program = { id: 'program-1', name: 'Chương trình 1', faculty: 'faculty-1' };
    await expect(useCase.execute(program)).resolves.toBeDefined();
  });
});
