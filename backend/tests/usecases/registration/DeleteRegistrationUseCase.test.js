const DeleteRegistrationUseCase = require('../../../src/application/usecases/registration/DeleteRegistrationUseCase');

describe('DeleteRegistrationUseCase', () => {
  let registrationRepositoryMock, studentRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    studentRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new DeleteRegistrationUseCase({
      registrationRepository: registrationRepositoryMock,
      studentRepository: studentRepositoryMock,
    });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if registration is used by student', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'sv1' });
    await expect(useCase.execute('reg-1')).rejects.toHaveProperty('status', 400);
  });

  it('should delete registration successfully', async () => {
    studentRepositoryMock.findOneByCondition.mockResolvedValue(null);
    registrationRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute('reg-1');
    expect(result.message).toMatch(/thành công/);
    expect(registrationRepositoryMock.delete).toHaveBeenCalledWith('reg-1');
  });
});
