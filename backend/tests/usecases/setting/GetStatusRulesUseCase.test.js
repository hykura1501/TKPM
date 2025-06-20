const GetStatusRulesUseCase = require('../../../src/application/usecases/setting/GetStatusRulesUseCase');

describe('GetStatusRulesUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetStatusRulesUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should return status transition rules', async () => {
    statusRepositoryMock.findAll.mockResolvedValue([
      { id: '1', name: new Map([['vi', 'A'], ['en', 'A']]), allowedStatus: ['2', '3'], color: 'red' },
      { id: '2', name: new Map([['vi', 'B'], ['en', 'B']]), allowedStatus: ['1'], color: 'blue' },
      { id: '3', name: new Map([['vi', 'C'], ['en', 'C']]), allowedStatus: [], color: 'green' }
    ]);
    const result = await useCase.execute('vi');
    expect(result).toHaveProperty('A');
    expect(result).toHaveProperty('B');
    expect(result).toHaveProperty('C');
  });
});
