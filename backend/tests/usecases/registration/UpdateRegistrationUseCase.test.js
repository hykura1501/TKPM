const UpdateRegistrationUseCase = require('../../../src/application/usecases/registration/UpdateRegistrationUseCase');

describe('UpdateRegistrationUseCase', () => {
  let registrationRepositoryMock, studentRepositoryMock, classSectionRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    studentRepositoryMock = {
      findStudentByMssv: jest.fn(),
    };
    classSectionRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new UpdateRegistrationUseCase({
      registrationRepository: registrationRepositoryMock,
      studentRepository: studentRepositoryMock,
      classSectionRepository: classSectionRepositoryMock,
    });
  });

  it('should throw error if registration is invalid', async () => {
    const invalidData = {};
    await expect(useCase.execute('reg-1', invalidData)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if registration does not exist', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute('reg-1', data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if student does not exist', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1' });
    studentRepositoryMock.findStudentByMssv.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute('reg-1', data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class section does not exist', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1' });
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute('reg-1', data)).rejects.toHaveProperty('status', 400);
  });

  it('should update registration successfully', async () => {
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1' });
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1' });
    registrationRepositoryMock.update.mockResolvedValue(true);
    registrationRepositoryMock.findAll.mockResolvedValue([{ id: 'reg-1' }]);
    const data = { studentId: 'sv1', classSectionId: 'class-1', status: 'active' };
    await expect(useCase.execute('reg-1', data)).resolves.toBeDefined();
  });
});
