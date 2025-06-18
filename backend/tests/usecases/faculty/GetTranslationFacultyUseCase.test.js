const GetTranslationFacultyUseCase = require('../../../src/application/usecases/faculty/GetTranslationFacultyUseCase');

describe('GetTranslationFacultyUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetTranslationFacultyUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if facultyId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('faculty-1')).rejects.toHaveProperty('status', 404);
  });

  it('should return translations if faculty exists', async () => {
    const faculty = {
      id: 'faculty-1',
      name: new Map([['vi', 'Khoa CNTT'], ['en', 'IT Faculty']]),
      description: new Map([['vi', 'Mô tả'], ['en', 'Description']]),
    };
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(faculty);
    const result = await useCase.execute('faculty-1');
    expect(result.vi).toBeDefined();
    expect(result.en).toBeDefined();
  });
});
