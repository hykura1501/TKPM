const UpdateTranslationFacultyUseCase = require('../../../src/application/usecases/faculty/UpdateTranslationFacultyUseCase');

describe('UpdateTranslationFacultyUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateTranslationFacultyUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if facultyId is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('faculty-1', {})).rejects.toHaveProperty('status', 404);
  });

  it('should update translations successfully', async () => {
    const faculty = {
      id: 'faculty-1',
      name: new Map([['vi', 'Khoa CNTT']]),
    };
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(faculty);
    facultyRepositoryMock.update.mockResolvedValue({ id: 'faculty-1' });
    const translations = {
      vi: { facultyName: 'Khoa Công nghệ thông tin' },
      en: { facultyName: 'IT Faculty' },
    };
    const result = await useCase.execute('faculty-1', translations);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(facultyRepositoryMock.update).toHaveBeenCalled();
  });
});
