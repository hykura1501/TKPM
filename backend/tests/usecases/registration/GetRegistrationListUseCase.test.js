const GetRegistrationListUseCase = require('../../../src/application/usecases/registration/GetRegistrationListUseCase');

describe('GetRegistrationListUseCase', () => {
  let registrationRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetRegistrationListUseCase({ registrationRepository: registrationRepositoryMock });
  });

  it('should return all registrations', async () => {
    registrationRepositoryMock.findAll.mockResolvedValue([
      { id: 'reg-1', studentId: 'sv1' },
      { id: 'reg-2', studentId: 'sv2' }
    ]);
    const result = await useCase.execute();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });
});
