const GetStatusRulesUseCase = require('../../../src/application/usecases/status/GetStatusRulesUseCase');

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
      { id: '1', allowedStatus: ['2', '3'] },
      { id: '2', allowedStatus: ['1'] },
      { id: '3', allowedStatus: [] }
    ]);
    const result = await useCase.execute();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('fromStatus');
    expect(result[0]).toHaveProperty('toStatus');
  });
});
