const StatusExistsUseCase = require('../../../src/application/usecases/status/StatusExistsUseCase');

describe('StatusExistsUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new StatusExistsUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should return true if status exists', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'status-1' });
    const result = await useCase.execute('status-1');
    expect(result).toBe(true);
  });

  it('should return false if status does not exist', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const result = await useCase.execute('status-999');
    expect(result).toBe(false);
  });
});
