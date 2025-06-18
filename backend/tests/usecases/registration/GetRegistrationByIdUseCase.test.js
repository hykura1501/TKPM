const GetRegistrationByIdUseCase = require('../../../src/application/usecases/registration/GetRegistrationByIdUseCase');

describe('GetRegistrationByIdUseCase', () => {
  let registrationRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetRegistrationByIdUseCase({ registrationRepository: registrationRepositoryMock });
  });

  it('should return registration if found', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1', studentId: 'sv1' });
    const result = await useCase.execute('reg-1');
    expect(result).toBeDefined();
    expect(result.id).toBe('reg-1');
  });

  it('should return null if not found', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const result = await useCase.execute('reg-999');
    expect(result).toBeNull();
  });
});
