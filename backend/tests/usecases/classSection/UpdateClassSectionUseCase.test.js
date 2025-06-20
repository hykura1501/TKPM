const UpdateClassSectionUseCase = require('../../../src/application/usecases/classSection/UpdateClassSectionUseCase');

describe('UpdateClassSectionUseCase', () => {
  let classSectionRepository, courseRepository, useCase;

  beforeEach(() => {
    classSectionRepository = {
      findOneByCondition: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn()
    };
    courseRepository = {
      findOneByCondition: jest.fn()
    };
    useCase = new UpdateClassSectionUseCase({ classSectionRepository, courseRepository });
  });

  it('should throw error if input is invalid', async () => {
    const data = { id: '', code: '', courseId: '' };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if class section does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce(null);
    const data = { id: 1, code: 'A', courseId: 1 };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should throw error if course does not exist', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce({ id: 1 });
    courseRepository.findOneByCondition.mockResolvedValueOnce(null);
    const data = { id: 1, code: 'A', courseId: 2 };
    await expect(useCase.execute(data)).rejects.toHaveProperty('status', 400);
  });

  it('should update class section successfully', async () => {
    classSectionRepository.findOneByCondition.mockResolvedValueOnce({ 
      id: '1',
      code: 'A',
      courseId: '2',
      academicYear: '2024',
      semester: '1',
      currentEnrollment: 10,
      instructor: 'GV01',
      maxCapacity: 30,
      schedule: '2-4-6',
      classroom: 'A101',
    });
    courseRepository.findOneByCondition.mockResolvedValueOnce({ 
      id: '2',
      code: 'CSE101',
      name: 'Course',
      credits: 3,
      faculty: 'faculty-1',
      description: 'desc',
      prerequisites: [],
      isActive: true,
      createdAt: '2023-01-01T00:00:00+00:00',
      updatedAt: '2025-06-20T00:00:00+00:00',
    });
    classSectionRepository.update.mockResolvedValue();
    classSectionRepository.findAll.mockResolvedValue([
      {
        id: '1',
        code: 'A',
        courseId: '2',
        academicYear: '2024',
        semester: '1',
        currentEnrollment: 10,
        instructor: 'GV01',
        maxCapacity: 30,
        schedule: '2-4-6',
        classroom: 'A101',
      }
    ]);
    const data = {
      id: '1',
      code: 'A',
      courseId: '2',
      academicYear: '2024',
      semester: '1',
      currentEnrollment: 10,
      instructor: 'GV01',
      maxCapacity: 30,
      schedule: '2-4-6',
      classroom: 'A101',
    };
    const result = await useCase.execute(data);
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result.classSections).toBeInstanceOf(Array);
  });
});