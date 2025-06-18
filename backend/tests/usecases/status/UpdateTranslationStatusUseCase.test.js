const UpdateTranslationStatusUseCase = require('../../../src/application/usecases/status/UpdateTranslationStatusUseCase');

describe('UpdateTranslationStatusUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateTranslationStatusUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should throw error if statusId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if status does not exist', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('status-1', {})).rejects.toHaveProperty('status', 404);
  });

  it('should update translations successfully', async () => {
    const status = {
      id: 'status-1',
      name: new Map([['vi', 'Trạng thái 1']]),
    };
    statusRepositoryMock.findOneByCondition.mockResolvedValue(status);
    statusRepositoryMock.update.mockResolvedValue({ id: 'status-1' });
    const translations = {
      vi: { statusName: 'Trạng thái 1 mới' },
      en: { statusName: 'New Status 1' },
    };
    const result = await useCase.execute('status-1', translations);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(statusRepositoryMock.update).toHaveBeenCalled();
  });
});
