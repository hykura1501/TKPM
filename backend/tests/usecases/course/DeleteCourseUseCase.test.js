const DeleteCourseUseCase = require('../../../src/application/usecases/course/DeleteCourseUseCase');

describe('DeleteCourseUseCase', () => {
  let courseRepositoryMock, classSectionRepositoryMock, useCase;

  beforeEach(() => {
    courseRepositoryMock = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    classSectionRepositoryMock = {
      findOneByCondition: jest.fn(),
    };
    useCase = new DeleteCourseUseCase({ courseRepository: courseRepositoryMock, classSectionRepository: classSectionRepositoryMock });
  });

  it('should throw error if id is not provided', async () => {
    await expect(useCase.execute()).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toHaveProperty('status', 404);
  });

  it('should deactivate course if class section exists', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue({ 
      id: 1,
      code: 'CSE101',
      name: new Map(Object.entries({ vi: 'Tên khóa học', en: 'Course Name' })),
      description: new Map(Object.entries({ vi: 'Mô tả', en: 'Description' })),
      faculty: 'faculty-1',
      credits: 3,
      prerequisites: [],
      isActive: true,
      createdAt: '2023-01-01T00:00:00+00:00',
      updatedAt: '2025-06-20T00:00:00+00:00',
    });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue({ id: 2 });
    courseRepositoryMock.findAll.mockResolvedValue([
      {
        id: 1,
        code: 'CSE101',
        name: new Map(Object.entries({ vi: 'Tên khóa học', en: 'Course Name' })),
        description: new Map(Object.entries({ vi: 'Mô tả', en: 'Description' })),
        faculty: 'faculty-1',
        credits: 3,
        prerequisites: [],
        isActive: false,
        createdAt: '2023-01-01T00:00:00+00:00',
        updatedAt: '2025-06-20T00:00:00+00:00',
      }
    ]);
    const result = await useCase.execute(1);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/vô hiệu hóa/);
    expect(courseRepositoryMock.update).toHaveBeenCalledWith(1, { isActive: false });
  });

  it('should delete course if no class section exists', async () => {
    courseRepositoryMock.findOneByCondition.mockResolvedValue({ 
      id: 1,
      code: 'CSE101',
      name: new Map(Object.entries({ vi: 'Tên khóa học', en: 'Course Name' })),
      description: new Map(Object.entries({ vi: 'Mô tả', en: 'Description' })),
      faculty: 'faculty-1',
      credits: 3,
      prerequisites: [],
      isActive: true,
      createdAt: '2023-01-01T00:00:00+00:00',
      updatedAt: '2025-06-20T00:00:00+00:00',
    });
    classSectionRepositoryMock.findOneByCondition.mockResolvedValue(null);
    courseRepositoryMock.findAll.mockResolvedValue([
      {
        id: 1,
        code: 'CSE101',
        name: new Map(Object.entries({ vi: 'Tên khóa học', en: 'Course Name' })),
        description: new Map(Object.entries({ vi: 'Mô tả', en: 'Description' })),
        faculty: 'faculty-1',
        credits: 3,
        prerequisites: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00+00:00',
        updatedAt: '2025-06-20T00:00:00+00:00',
      }
    ]);
    const result = await useCase.execute(1);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/thành công/);
    expect(courseRepositoryMock.delete).toHaveBeenCalledWith(1);
  });
});
