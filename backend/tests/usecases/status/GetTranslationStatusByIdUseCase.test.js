const GetTranslationStatusByIdUseCase = require('../../../src/application/usecases/status/GetTranslationStatusByIdUseCase');

describe('GetTranslationStatusByIdUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetTranslationStatusByIdUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should throw error if statusId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if status does not exist', async () => {
    statusRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('status-1')).rejects.toHaveProperty('status', 404);
  });

  it('should return translations if status exists', async () => {
    const status = {
      id: 'status-1',
      name: new Map([['vi', 'Trạng thái 1'], ['en', 'Status 1']]),
    };
    statusRepositoryMock.findOneByCondition.mockResolvedValue(status);
    const result = await useCase.execute('status-1');
    expect(result.vi).toBeDefined();
    expect(result.en).toBeDefined();
  });
});
