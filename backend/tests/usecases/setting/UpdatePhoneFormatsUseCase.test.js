const UpdatePhoneFormatsUseCase = require('../../../src/application/usecases/setting/UpdatePhoneFormatsUseCase');

describe('UpdatePhoneFormatsUseCase', () => {
  let settingRepositoryMock, useCase;

  beforeEach(() => {
    settingRepositoryMock = {
      update: jest.fn(),
    };
    useCase = new UpdatePhoneFormatsUseCase({ settingRepository: settingRepositoryMock });
  });

  it('should throw error if phoneFormats is empty', async () => {
    await expect(useCase.execute('[]')).rejects.toHaveProperty('status', 400);
  });

  it('should update phone formats successfully', async () => {
    settingRepositoryMock.update.mockResolvedValue(true);
    const phoneFormats = JSON.stringify(['+84', '0123']);
    const result = await useCase.execute(phoneFormats);
    expect(result.message).toMatch(/thành công/);
    expect(settingRepositoryMock.update).toHaveBeenCalled();
  });
});
