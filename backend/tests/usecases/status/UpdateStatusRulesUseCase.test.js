const UpdateStatusRulesUseCase = require('../../../src/application/usecases/status/UpdateStatusRulesUseCase');

describe('UpdateStatusRulesUseCase', () => {
  let statusRepositoryMock, useCase;

  beforeEach(() => {
    statusRepositoryMock = {
      update: jest.fn(),
    };
    useCase = new UpdateStatusRulesUseCase({ statusRepository: statusRepositoryMock });
  });

  it('should update status rules successfully', async () => {
    statusRepositoryMock.update.mockResolvedValue(true);
    const rules = JSON.stringify([
      { fromStatus: '1', toStatus: ['2', '3'] },
      { fromStatus: '2', toStatus: ['1'] }
    ]);
    const result = await useCase.execute(rules);
    expect(result.message).toMatch(/thành công/);
    expect(statusRepositoryMock.update).toHaveBeenCalledWith('1', { allowedStatus: ['2', '3'] });
    expect(statusRepositoryMock.update).toHaveBeenCalledWith('2', { allowedStatus: ['1'] });
  });
});
