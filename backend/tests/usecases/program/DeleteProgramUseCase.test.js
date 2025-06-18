const DeleteProgramUseCase = require('../../../src/application/usecases/program/DeleteProgramUseCase');

describe('DeleteProgramUseCase', () => {
  let programRepositoryMock, studentRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    studentRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new DeleteProgramUseCase({ programRepository: programRepositoryMock, studentRepository: studentRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if program is used by student', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'student-1' });
    await expect(useCase.execute('program-1')).rejects.toHaveProperty('status', 400);
  });

  it('should delete program successfully', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue(null);
    programRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute('program-1');
    expect(result.message).toMatch(/thành công/);
    expect(programRepositoryMock.delete).toHaveBeenCalledWith('program-1');
  });
});
