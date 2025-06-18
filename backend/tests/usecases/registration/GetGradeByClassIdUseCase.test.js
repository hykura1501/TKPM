const GetGradeByClassIdUseCase = require('../../../src/application/usecases/registration/GetGradeByClassIdUseCase');

describe('GetGradeByClassIdUseCase', () => {
  let registrationRepositoryMock, useCase;

  beforeEach(() => {
    registrationRepositoryMock = {
      findAllByCondition: jest.fn(),
    };
    useCase = new GetGradeByClassIdUseCase({ registrationRepository: registrationRepositoryMock });
  });

  it('should throw error if classId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if no grades found', async () => {
    registrationRepositoryMock.findAllByCondition.mockResolvedValue(null);
    await expect(useCase.execute('class-1')).rejects.toHaveProperty('status', 404);
  });

  it('should return grades if found', async () => {
    registrationRepositoryMock.findAllByCondition.mockResolvedValue([
      { studentId: 'sv1', grade: 8 },
      { studentId: 'sv2', grade: 9 }
    ]);
    const result = await useCase.execute('class-1');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].grade).toBe(8);
  });
});
