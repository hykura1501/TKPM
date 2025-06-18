const CreateStatusUseCase = require('../../../src/application/usecases/status/CreateStatusUseCase');

describe('CreateStatusUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      getNextId: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateStatusUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should throw error if status is invalid', async () => {
    const invalidStatus = {};
    await expect(useCase.execute(invalidStatus)).rejects.toHaveProperty('status', 400);
  });

  it('should create status successfully', async () => {
    statusRepositoryMock.getNextId.mockResolvedValue('status-1');
    statusRepositoryMock.create.mockResolvedValue({ id: 'status-1' });
    statusRepositoryMock.findAll.mockResolvedValue([
      { id: 'status-1', name: new Map([['vi', 'Trạng thái 1'], ['en', 'Status 1']]), color: 'red', allowedStatus: [] }
    ]);
    const status = { name: 'Trạng thái 1', color: 'red', allowedStatus: [] };
    const result = await useCase.execute(status, 'vi');
    expect(result.message).toMatch(/thành công/);
  });
});
