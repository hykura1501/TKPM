const GetLogListUseCase = require('../../../src/application/usecases/log/GetLogListUseCase');

describe('GetLogListUseCase', () => {
  let logRepositoryMock, useCase;

  beforeEach(() => {
    logRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetLogListUseCase({ logRepository: logRepositoryMock });
  });

  it('should return all logs', async () => {
    const logs = [
      { id: 1, message: 'Log 1' },
      { id: 2, message: 'Log 2' },
    ];
    logRepositoryMock.findAll.mockResolvedValue(logs);
    const result = await useCase.execute();
    expect(result).toEqual(logs);
  });
});
