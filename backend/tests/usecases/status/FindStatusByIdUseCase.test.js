const FindStatusByIdUseCase = require('../../../src/application/usecases/status/FindStatusByIdUseCase');

describe('FindStatusByIdUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new FindStatusByIdUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should throw error if status not found', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('status-999')).rejects.toHaveProperty('status', 404);
  });

  it('should return status if found', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'status-1', name: new Map([['vi', 'Trạng thái 1']]) });
    const result = await useCase.execute('status-1');
    expect(result).toBeDefined();
    expect(result.id).toBe('status-1');
  });
});
