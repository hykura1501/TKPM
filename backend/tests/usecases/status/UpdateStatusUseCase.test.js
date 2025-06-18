const UpdateStatusUseCase = require('../../../src/application/usecases/status/UpdateStatusUseCase');

describe('UpdateStatusUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new UpdateStatusUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should throw error if status is invalid', async () => {
    const invalidStatus = {};
    await expect(useCase.execute(invalidStatus)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if status does not exist', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const status = { id: 'status-999', name: 'Không tồn tại', color: 'red', allowedStatus: [] };
    await expect(useCase.execute(status)).rejects.toHaveProperty('status', 404);
  });

  it('should update status successfully', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'status-1', name: new Map([['vi', 'Trạng thái 1']]), color: 'red', allowedStatus: [] });
    statusRepositoryMock.update.mockResolvedValue({ id: 'status-1' });
    statusRepositoryMock.findAll.mockResolvedValue([{ id: 'status-1', name: new Map([['vi', 'Trạng thái 1']]), color: 'red', allowedStatus: [] }]);
    const status = { id: 'status-1', name: 'Trạng thái 1', color: 'red', allowedStatus: [] };
    await expect(useCase.execute(status)).resolves.toBeDefined();
  });
});
