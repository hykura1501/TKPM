const GetCourseListUseCase = require('../../../src/application/usecases/course/GetCourseListUseCase');

describe('GetCourseListUseCase', () => {
  let courseRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findAll: jest.fn(),
    };
    useCase = new GetCourseListUseCase({ courseRepository: courseRepositoryMock });
  });

  it('should return empty array if no courses found', async () => {
    courseRepositoryMock.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('should return formatted courses if found', async () => {
    courseRepositoryMock.findAll.mockResolvedValue([
      {
        id: 'course-5',
        code: 'NN001',
        name: new Map(Object.entries({ vi: 'Tiếng Anh cơ bản', en: 'Basic English' })),
        credits: 2,
        faculty: 'faculty-1',
        description: new Map(Object.entries({ vi: 'Khóa học tiếng Anh cơ bản cho sinh viên năm nhất', en: 'Basic English course for first-year students.' })),
        prerequisites: [],
        isActive: true,
        createdAt: '2023-01-05T00:00:00+00:00',
        updatedAt: '2025-06-17T09:19:55.697Z',
      },
      {
        id: 'course-2',
        code: 'CNTT002',
        name: new Map(Object.entries({ vi: 'Cấu trúc dữ liệu và Giải thuật1', en: 'Data Structures and Algorithms' })),
        credits: 4,
        faculty: 'faculty-2',
        description: new Map(Object.entries({ vi: 'Khóa học về cấu trúc dữ liệu và các thuật toán cơ bản.', en: 'Covers basic data structures and algorithms.' })),
        prerequisites: ['CNTT001'],
        isActive: true,
        createdAt: '2023-01-02T00:00:00+00:00',
        updatedAt: '2025-05-15T14:18:31.078Z',
      }
    ]);
    const result = await useCase.execute('vi');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Tiếng Anh cơ bản');
    expect(result[1].name).toBe('Cấu trúc dữ liệu và Giải thuật1');
  });
});
