const DeleteFacultyUseCase = require('../../../src/application/usecases/faculty/DeleteFacultyUseCase');

describe('DeleteFacultyUseCase', () => {
  let facultyRepositoryMock, useCase;

  beforeEach(() => {
    facultyRepositoryMock = {
      findOneByCondition: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new DeleteFacultyUseCase({ facultyRepository: facultyRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if faculty does not exist', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute('faculty-1')).rejects.toHaveProperty('status', 404);
  });

  it('should delete faculty successfully', async () => {
    facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'faculty-1', name: new Map([['vi', 'Khoa CNTT']]) });
    facultyRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute('faculty-1');
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(facultyRepositoryMock.delete).toHaveBeenCalledWith('faculty-1');
  });
});
