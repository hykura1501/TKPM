const GetDomainsUseCase = require('../../../src/application/usecases/setting/GetDomainsUseCase');

describe('GetDomainsUseCase', () => {
  let settingRepositoryMock, useCase;

  beforeEach(() => {
    settingRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetDomainsUseCase({ settingRepository: settingRepositoryMock });
  });

  it('should throw error if setting not found', async () => {
    settingRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute()).rejects.toThrow('Không tìm thấy cài đặt domain');
  });

  it('should return domains if found', async () => {
    settingRepositoryMock.findOneByCondition.mockResolvedValue({ allowDomains: ['gmail.com', 'yahoo.com'] });
    const result = await useCase.execute();
    expect(result.domains).toEqual(['gmail.com', 'yahoo.com']);
  });
});
