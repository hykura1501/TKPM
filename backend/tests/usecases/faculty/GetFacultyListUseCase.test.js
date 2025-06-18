const GetFacultyListUseCase = require('../../../src/application/usecases/faculty/GetFacultyListUseCase');

describe('GetFacultyListUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetFacultyListUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should return empty array if no faculties found', async () => {
    facultyRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('should return formatted faculties if found', async () => {
    facultyRepositoryMock.findAll.mockResolvedValue([
      { id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) },
      { id: 'faculty-2', name: new Map([['vi', 'Khoa Toán']]) }
    ]);
    const result = await useCase.execute('vi');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Khoa CNTT');
    expect(result[1].name).toBe('Khoa Toán');
  });
});
