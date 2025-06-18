const SaveGradeByClassIdUseCase = require('../../../src/application/usecases/registration/SaveGradeByClassIdUseCase');

describe('SaveGradeByClassIdUseCase', () => {
  let registrationRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findAllByCondition: jest.fn(),
      updateGrade: jest.fn(),
    };
    useCase = new SaveGradeByClassIdUseCase({ registrationRepository: registrationRepositoryMock });
  });

  it('should throw error if classId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if no grades found', async () => {
    registrationRepositoryMock.findAllByCondition.mockResolvedValue(null);
    await expect(useCase.execute('class-1', {})).rejects.toHaveProperty('status', 404);
  });

  it('should update grades successfully', async () => {
    registrationRepositoryMock.findAllByCondition.mockResolvedValue([
      { studentId: 'sv1' },
      { studentId: 'sv2' }
    ]);
    registrationRepositoryMock.updateGrade.mockResolvedValue(true);
    const data = { sv1: 8, sv2: 9 };
    const result = await useCase.execute('class-1', data);
    expect(result.message).toMatch(/thành công/);
    expect(registrationRepositoryMock.updateGrade).toHaveBeenCalledWith('sv1', 'class-1', 8);
    expect(registrationRepositoryMock.updateGrade).toHaveBeenCalledWith('sv2', 'class-1', 9);
  });
});
