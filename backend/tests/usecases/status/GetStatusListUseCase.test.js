const GetStatusListUseCase = require('../../../src/application/usecases/status/GetStatusListUseCase');

describe('GetStatusListUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetStatusListUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should return formatted statuses if found', async () => {
    statusRepositoryMock.findAll.mockResolvedValue([
      { id: 'status-1', name: new Map([['vi', 'Trạng thái 1']]) },
      { id: 'status-2', name: new Map([['vi', 'Trạng thái 2']]) }
    ]);
    const result = await useCase.execute('vi');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Trạng thái 1');
    expect(result[1].name).toBe('Trạng thái 2');
  });
});
