const CreateRegistrationUseCase = require('../../../src/application/usecases/registration/CreateRegistrationUseCase');

describe('CreateRegistrationUseCase', () => {
  let registrationRepositoryMock, studentRepositoryMock, classSectionRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findOneByCondition: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    studentRepositoryMock = {
      findStudentByMssv: jest.fn(),
    };
    classSectionRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreateRegistrationUseCase({
      registrationRepository: registrationRepositoryMock,
      studentRepository: studentRepositoryMock,
      classSectionRepository: classSectionRepositoryMock,
    });
  });

  it('should throw error if registration is invalid', async () => {
    const invalidData = {};
    await expect(useCase.execute(invalidData)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if student does not exist', async () => {
    studentRepositoryMock.findStudentByMssv.mockResolvedValue(null);
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1', currentEnrollment: 0, maxCapacity: 10 });
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class section does not exist', async () => {
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue(null);
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class is full', async () => {
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1', currentEnrollment: 10, maxCapacity: 10 });
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if already registered', async () => {
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1', currentEnrollment: 0, maxCapacity: 10 });
    registrationRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'reg-1' });
    const data = { studentId: 'sv1', classSectionId: 'class-1' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should create registration successfully', async () => {
    studentRepositoryMock.findStudentByMssv.mockResolvedValue({ id: 'sv1' });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'class-1', currentEnrollment: 0, maxCapacity: 10 });
    registrationRepositoryMock.findOneByCondition.mockResolvedValue(null);
    registrationRepositoryMock.create.mockResolvedValue({ id: 'reg-1' });
    const data = { studentId: 'sv1', classSectionId: 'class-1', status: 'active' };
    await expect(useCase.execute(data)).resolves.toBeDefined();
  });
});
