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
      { id: '1', name: 'A', allowedStatus: ['2', '3'] },
      { id: '2', name: 'B', allowedStatus: ['1'] },
      { id: '3', name: 'C', allowedStatus: [] }
    ]);
    const result = await useCase.execute('vi');
    expect(result).toHaveProperty('A');
    expect(result).toHaveProperty('B');
    expect(result).toHaveProperty('C');
  });
});
