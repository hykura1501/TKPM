const GetAllSettingsUseCase = require('../../../src/application/usecases/setting/GetAllSettingsUseCase');

describe('GetAllSettingsUseCase', () => {
  let settingRepositoryMock, statusRepositoryMock, useCase;

  beforeEach(() => {
    settingRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    statusRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetAllSettingsUseCase({ settingRepository: settingRepositoryMock, statusRepository: statusRepositoryMock });
  });

  it('should throw error if settings not found', async () => {
    settingRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute()).rejects.toThrow('Không tìm thấy cài đặt');
  });

  it('should return all settings if found', async () => {
    settingRepositoryMock.findOneByCondition.mockResolvedValue({ allowDomains: ['gmail.com'], allowPhones: ['+84'] });
    statusRepositoryMock.findAll.mockResolvedValue([
      { id: '1', allowedStatus: ['2'] },
      { id: '2', allowedStatus: ['1'] }
    ]);
    const result = await useCase.execute();
    expect(result.allowedEmailDomains).toEqual(['gmail.com']);
    expect(result.phoneFormats).toEqual(['+84']);
    expect(result.statusTransitionRules.length).toBe(2);
  });
});
