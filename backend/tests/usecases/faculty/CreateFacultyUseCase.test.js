const CreateFacultyUseCase = require('../../../src/application/usecases/faculty/CreateFacultyUseCase');

describe('CreateFacultyUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      getNextId: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateFacultyUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if faculty is invalid', async () => {
    const invalidFaculty = {};
    await expect(useCase.execute(invalidFaculty)).rejects.toHaveProperty('status', 400);
  });

  it('should create faculty successfully', async () => {
    facultyRepositoryMock.getNextId.mockResolvedValue('faculty-1');
    facultyRepositoryMock.create.mockResolvedValue({ id: 'faculty-1' });
    facultyRepositoryMock.findAll.mockResolvedValue([
      { id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT'], ['en', 'IT Faculty']]) }
    ]);
    const faculty = { name: 'Khoa CNTT' };
    const result = await useCase.execute(faculty, 'vi');
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
  });
});
