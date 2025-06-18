const GetProgramListUseCase = require('../../../src/application/usecases/program/GetProgramListUseCase');

describe('GetProgramListUseCase', () => {
  let programRepositoryMock, useCase;

  beforeEach(() => {
    programRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetProgramListUseCase({ programRepository: programRepositoryMock });
  });

  it('should return formatted programs if found', async () => {
    programRepositoryMock.findAll.mockResolvedValue([
      { id: 'program-1', name: new Map([['vi', 'Chương trình 1']]), faculty: 'faculty-1' },
      { id: 'program-2', name: new Map([['vi', 'Chương trình 2']]), faculty: 'faculty-2' }
    ]);
    const result = await useCase.execute('vi');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Chương trình 1');
    expect(result[1].name).toBe('Chương trình 2');
  });
});
