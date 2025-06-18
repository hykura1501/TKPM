const CancelRegistrationUseCase = require('../../../src/application/usecases/registration/CancelRegistrationUseCase');

describe('CancelRegistrationUseCase', () => {
  let registrationRepositoryMock, classSectionRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    classSectionRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CancelRegistrationUseCase({
      registrationRepository: registrationRepositoryMock,
      classSectionRepository: classSectionRepositoryMock,
    });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if registration does not exist', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('reg-1')).rejects.toHaveProperty('status', 404);
  });

  it('should throw error if class section does not exist', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1', classSectionId: 'class-1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('reg-1')).rejects.toHaveProperty('status', 404);
  });

  it('should cancel registration successfully', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1', classSectionId: 'class-1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1', currentEnrollment: 2 });
    classSectionRepositoryMock.update.mockResolvedValue(true);
    registrationRepositoryMock.update.mockResolvedValue(true);
    registrationRepositoryMock.findAll.mockResolvedValue([{ id: 'reg-1' }]);
    const result = await useCase.execute('reg-1');
    expect(result.message).toMatch(/thành công/);
    expect(classSectionRepositoryMock.update).toHaveBeenCalled();
    expect(registrationRepositoryMock.update).toHaveBeenCalled();
  });
});
