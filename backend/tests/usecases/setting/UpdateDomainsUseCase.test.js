const UpdateDomainsUseCase = require('../../../src/application/usecases/setting/UpdateDomainsUseCase');

describe('UpdateDomainsUseCase', () => {
  let settingRepositoryMock, useCase;

  beforeEach(() => {
    settingRepositoryMock = {
      update: jest.fn(),
    };
    useCase = new UpdateDomainsUseCase({ settingRepository: settingRepositoryMock });
  });

  it('should throw error if domains is empty', async () => {
    await expect(useCase.execute([])).rejects.toHaveProperty('status', 400);
  });

  it('should update domains successfully', async () => {
    settingRepositoryMock.update.mockResolvedValue(true);
    const domains = ['gmail.com', 'yahoo.com'];
    const result = await useCase.execute(domains);
    expect(result.message).toMatch(/thành công/);
    expect(settingRepositoryMock.update).toHaveBeenCalled();
  });
});
