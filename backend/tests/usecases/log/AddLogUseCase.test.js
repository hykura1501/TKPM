const AddLogUseCase = require('../../../src/application/usecases/log/AddLogUseCase');

describe('AddLogUseCase', () => {
  let logRepositoryMock, useCase;

  beforeEach(() => {
    logRepositoryMock = {
      create: jest.fn(),
    };
    useCase = new AddLogUseCase({ logRepository: logRepositoryMock });
  });

  it('should throw error if log is invalid', async () => {
    const invalidLog = {};
    await expect(useCase.execute(invalidLog)).rejects.toHaveProperty('status', 400);
  });

  it('should add log successfully', async () => {
    const logData = { message: 'Test log', level: 'info', action: 'test', entity: 'test', user: 'admin', details: 'details' };
    logRepositoryMock.create.mockResolvedValue({ id: 1, ...logData });
    // Giả lập schema hợp lệ bằng cách patch lại safeParse
    const { logEntrySchema } = require('../../../src/validators/logValidator');
    jest.spyOn(logEntrySchema, 'safeParse').mockReturnValue({ success: true, data: logData });
    const result = await useCase.execute(logData);
    expect(result.message).toMatch(/thành công/);
    expect(result.log).toBeDefined();
  });
});
