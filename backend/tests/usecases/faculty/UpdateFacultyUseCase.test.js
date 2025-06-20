const UpdateFacultyUseCase = require('../../../src/application/usecases/faculty/UpdateFacultyUseCase');

describe('UpdateFacultyUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new UpdateFacultyUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if faculty is invalid', async () => {
    const invalidFaculty = {};
    await expect(useCase.execute(invalidFaculty)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValueOnce(null);
    const faculty = { id: 'faculty-999', code: 'FAKE001', name: 'Không tồn tại' };
    await expect(useCase.execute(faculty)).rejects.toHaveProperty('status', 404);
  });

  it('should update faculty successfully', async () => {
    facultyRepositoryMock.findOneByCondition
      .mockResolvedValueOnce(null) // code check
      .mockResolvedValueOnce(null) // name check
      .mockResolvedValueOnce({ id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) }) // id check
      .mockResolvedValueOnce({ id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) }); // id check sau validate
    facultyRepositoryMock.update.mockResolvedValue({ id: 'faculty-1' });
    facultyRepositoryMock.findAll.mockResolvedValue([{ id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) }]);
    const faculty = { id: 'faculty-1', code: 'CNTT', name: 'Khoa CNTT' };
    await expect(useCase.execute(faculty)).resolves.toBeDefined();
  });
});
