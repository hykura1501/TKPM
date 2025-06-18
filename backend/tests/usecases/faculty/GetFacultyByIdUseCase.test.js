const GetFacultyByIdUseCase = require('../../../src/application/usecases/faculty/GetFacultyByIdUseCase');

describe('GetFacultyByIdUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new GetFacultyByIdUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('faculty-1')).rejects.toHaveProperty('status', 404);
  });

  it('should return formatted faculty if found', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) });
    const result = await useCase.execute('faculty-1');
    expect(result).toBeDefined();
    expect(result.id).toBe('faculty-1');
  });
});
