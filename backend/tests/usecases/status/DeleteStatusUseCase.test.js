const DeleteStatusUseCase = require('../../../src/application/usecases/status/DeleteStatusUseCase');

describe('DeleteStatusUseCase', () => {
  let statusRepositoryMock, studentRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    studentRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new DeleteStatusUseCase({ statusRepository: statusRepositoryMock, studentRepository: studentRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if status is used by student', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'sv1' });
    await expect(useCase.execute('status-1')).rejects.toHaveProperty('status', 400);
  });

  it('should delete status successfully', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue(null);
    statusRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute('status-1');
    expect(result.message).toMatch(/thành công/);
    expect(statusRepositoryMock.delete).toHaveBeenCalledWith('status-1');
  });
});
