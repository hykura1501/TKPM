# Inversion of Control and Dependency Injection

# Inversion of Control (IoC) và Dependency Injection (DI)

## 1. Khái niệm cơ bản

### Inversion of Control (IoC)

**Inversion of Control** là một nguyên lý thiết kế phần mềm trong đó quyền điều khiển việc tạo và quản lý các đối tượng được chuyển giao từ class sử dụng sang một thành phần bên ngoài (thường là một container hoặc framework).

Thay vì một class tự tạo ra các dependency của nó, IoC container sẽ đảm nhận việc này và "inject" các dependency vào class đó.

### Dependency Injection (DI)

**Dependency Injection** là một kỹ thuật cụ thể để implement IoC. DI cho phép các dependency được "Inject" vào một class từ bên ngoài thay vì class đó phải tự tạo ra chúng.

## 2. Lợi ích của IoC và DI

- **Loose Coupling**: Giảm sự phụ thuộc chặt chẽ giữa các class
- **Testability**: Dễ dàng mock và test các component
- **Maintainability**: Code dễ bảo trì và mở rộng
- **Flexibility**: Dễ thay đổi implementation mà không ảnh hưởng đến code khác
- **Single Responsibility**: Mỗi class chỉ tập trung vào logic riêng của nó

## 3. Các loại Dependency Injection

### 3.1 Constructor Injection (Inject Constructor)

Dependency được truyền vào thông qua constructor của class.

### 3.2 Setter Injection (Inject Setter)

Dependency được truyền vào thông qua các method setter.

### 3.3 Interface Injection (Inject Interface)

Dependency được truyền vào thông qua interface.

## 4. Ví dụ thực tế từ hệ thống Class Section

### 4.1 Không sử dụng DI (Bad Practice)

```jsx
// ❌ Bad: Tight coupling
class CreateClassSectionUseCase {
  constructor() {
    // Tự tạo dependencies - tight coupling
    this.classSectionRepository = new ClassSectionRepository();
    this.courseRepository = new CourseRepository();
  }

  async execute(data) {
    // Logic xử lý...
    const existingCourse = await this.courseRepository.findOneByCondition({ id: data.courseId });
    // ...
  }
}

```

**Vấn đề:**

- Hard to test (khó test)
- Tight coupling (liên kết chặt)
- Khó thay đổi implementation
- Không flexible

### 4.2 Sử dụng Constructor Injection (Good Practice)

```jsx
// ✅ Good: Using Constructor Injection
class CreateClassSectionUseCase {
  /**
   * Dependencies được inject thông qua constructor
   */
  constructor({ classSectionRepository, courseRepository }) {
    this.classSectionRepository = classSectionRepository;
    this.courseRepository = courseRepository;
  }

  async execute(data) {
    // Validate input
    const parsed = classSectionSchema.safeParse(data);
    if (!parsed.success) {
      throw { status: 400, message: parsed.error.errors };
    }

    // Check duplicate code
    const existingClassSection = await this.classSectionRepository.findOneByCondition({
      code: parsed.data.code
    });
    if (existingClassSection) {
      throw { status: 400, message: 'Mã lớp học đã tồn tại' };
    }

    // Check course exists
    const existingCourse = await this.courseRepository.findOneByCondition({
      id: parsed.data.courseId
    });
    if (!existingCourse) {
      throw { status: 400, message: 'Khóa học không tồn tại' };
    }

    // Create new class section
    const newId = await this.classSectionRepository.getNextId();
    const newClassSection = { ...parsed.data, id: newId };
    await this.classSectionRepository.create(newClassSection);

    return { message: "Thêm lớp học thành công" };
  }
}

```

### 4.3 Repository Pattern với Interface

```jsx
// Interface định nghĩa contract
class IClassSectionRepository {
  async findAll() { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async findOneByCondition(condition) { throw new Error('Not implemented'); }
  async getNextId() { throw new Error('Not implemented'); }
}

// Concrete implementation
class ClassSectionRepository extends IClassSectionRepository {
  async findAll() {
    return await ClassSection.find({});
  }

  async create(data) {
    const newClassSection = new ClassSection(data);
    return await newClassSection.save();
  }

  async findOneByCondition(condition) {
    return await ClassSection.findOne(condition);
  }

  // ... other methods
}

```

### 4.4 Controller với DI

```jsx
class ClassSectionController {
  /**
   * Tất cả use cases được inject vào controller
   */
  constructor({
    getClassSectionListUseCase,
    createClassSectionUseCase,
    updateClassSectionUseCase,
    deleteClassSectionUseCase,
    getClassSectionByCourseIdUseCase
  }) {
    this.getClassSectionListUseCase = getClassSectionListUseCase;
    this.createClassSectionUseCase = createClassSectionUseCase;
    this.updateClassSectionUseCase = updateClassSectionUseCase;
    this.deleteClassSectionUseCase = deleteClassSectionUseCase;
    this.getClassSectionByCourseIdUseCase = getClassSectionByCourseIdUseCase;
  }

  async createClassSection(req, res) {
    try {
      const result = await this.createClassSectionUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.message || "Lỗi khi tạo lớp học"
      });
    }
  }

  async getListClassSections(req, res) {
    try {
      const sections = await this.getClassSectionListUseCase.execute();
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

```

## 5. DI Container Example

```jsx
// Container đơn giản để quản lý dependencies
class DIContainer {
  constructor() {
    this.dependencies = new Map();
    this.singletons = new Map();
  }

  // Đăng ký dependency
  register(name, factory, options = {}) {
    this.dependencies.set(name, { factory, options });
  }

  // Resolve dependency
  resolve(name) {
    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency ${name} not found`);
    }

    // Singleton pattern
    if (dependency.options.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const instance = dependency.factory(this);

    if (dependency.options.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }
}

// Cấu hình container
const container = new DIContainer();

// Register repositories
container.register('classSectionRepository', () => new ClassSectionRepository(), { singleton: true });
container.register('courseRepository', () => new CourseRepository(), { singleton: true });

// Register use cases
container.register('createClassSectionUseCase', (container) =>
  new CreateClassSectionUseCase({
    classSectionRepository: container.resolve('classSectionRepository'),
    courseRepository: container.resolve('courseRepository')
  })
);

container.register('getClassSectionListUseCase', (container) =>
  new GetClassSectionListUseCase({
    classSectionRepository: container.resolve('classSectionRepository')
  })
);

// Register controller
container.register('classSectionController', (container) =>
  new ClassSectionController({
    createClassSectionUseCase: container.resolve('createClassSectionUseCase'),
    getClassSectionListUseCase: container.resolve('getClassSectionListUseCase'),
    // ... other use cases
  })
);

```

## 6. Testing với DI

### 6.1 Mock Repository cho Unit Test

```jsx
// Mock repository cho testing
class MockClassSectionRepository extends IClassSectionRepository {
  constructor() {
    super();
    this.data = [];
    this.nextId = 1;
  }

  async findAll() {
    return [...this.data];
  }

  async create(data) {
    const newItem = { ...data, id: `section-${this.nextId++}` };
    this.data.push(newItem);
    return newItem;
  }

  async findOneByCondition(condition) {
    return this.data.find(item => {
      return Object.keys(condition).every(key => item[key] === condition[key]);
    });
  }

  async getNextId() {
    return `section-${this.nextId}`;
  }
}

// Test case
describe('CreateClassSectionUseCase', () => {
  let useCase;
  let mockClassSectionRepo;
  let mockCourseRepo;

  beforeEach(() => {
    mockClassSectionRepo = new MockClassSectionRepository();
    mockCourseRepo = new MockCourseRepository();

    useCase = new CreateClassSectionUseCase({
      classSectionRepository: mockClassSectionRepo,
      courseRepository: mockCourseRepo
    });
  });

  test('should create class section successfully', async () => {
    // Arrange
    const testData = {
      code: 'CS101-01',
      courseId: 'course-1',
      academicYear: '2024',
      semester: 'Fall',
      instructor: 'Dr. Smith',
      maxCapacity: 30,
      schedule: 'Mon/Wed 9:00-10:30',
      classroom: 'Room 101'
    };

    // Mock course exists
    mockCourseRepo.data.push({ id: 'course-1', name: 'Computer Science 101' });

    // Act
    const result = await useCase.execute(testData);

    // Assert
    expect(result.message).toBe('Thêm lớp học thành công');
    expect(mockClassSectionRepo.data).toHaveLength(1);
    expect(mockClassSectionRepo.data[0].code).toBe('CS101-01');
  });

  test('should throw error when course does not exist', async () => {
    // Arrange
    const testData = {
      code: 'CS101-01',
      courseId: 'non-existent-course',
      // ... other fields
    };

    // Act & Assert
    await expect(useCase.execute(testData)).rejects.toThrow('Khóa học không tồn tại');
  });
});

```

## 7. Clean Architecture với DI

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐    ┌──────────────────────────────────┐│
│  │   Controllers   │◄───┤           Routes               ││
│  └─────────────────┘    └──────────────────────────────────┘│
└─────────────────┬───────────────────────────────────────────┘
                  │ DI
┌─────────────────▼───────────────────────────────────────────┐
│                  Application Layer                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Use Cases                             ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ CreateClassSectionUseCase                           │││
│  │  │ UpdateClassSectionUseCase                           │││
│  │  │ DeleteClassSectionUseCase                           │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────┬───────────────────────────────────────────┘
                  │ DI
┌─────────────────▼───────────────────────────────────────────┐
│                    Domain Layer                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │    Entities     │    │        Repositories             │ │
│  │                 │    │       (Interfaces)              │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ DI
┌─────────────────────────▼───────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Repository Implementations                 ││
│  │              Database Access                            ││
│  │              External Services                          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

```

## 8. Best Practices

### 8.1 Nguyên tắc SOLID với DI

- **Single Responsibility**: Mỗi class chỉ có một lý do để thay đổi
- **Open/Closed**: Mở cho mở rộng, đóng cho sửa đổi
- **Liskov Substitution**: Có thể thay thế implementation mà không ảnh hưởng
- **Interface Segregation**: Chia nhỏ interface thành các phần cụ thể
- **Dependency Inversion**: Phụ thuộc vào abstraction, không phụ thuộc vào concrete

### 8.2 Dependency Injection Best Practices

1. **Luôn sử dụng interfaces**: Định nghĩa contract rõ ràng
2. **Constructor injection**: Ưu tiên constructor injection cho required dependencies
3. **Avoid service locator**: Không sử dụng service locator pattern
4. **Keep constructors simple**: Constructor chỉ nên assign dependencies
5. **Use composition root**: Tập trung cấu hình DI ở một nơi

### 8.3 Tránh các Anti-patterns

```jsx
// ❌ Service Locator Anti-pattern
class BadUseCase {
  execute() {
    const repo = ServiceLocator.get('repository'); // Bad!
    // ...
  }
}

// ❌ Setter Injection cho required dependencies
class BadUseCase {
  setRepository(repo) {
    this.repository = repo;
  }

  execute() {
    if (!this.repository) {
      throw new Error('Repository not set'); // Bad!
    }
  }
}

// ✅ Constructor Injection
class GoodUseCase {
  constructor({ repository }) {
    this.repository = repository; // Good!
  }

  execute() {
    // Repository is guaranteed to exist
  }
}

```

## 9. Kết luận

IoC và DI là những nguyên lý quan trọng trong việc xây dựng ứng dụng có kiến trúc sạch, dễ test và dễ bảo trì. Thông qua việc đảo ngược quyền điều khiển và Inject dependency, chúng ta có thể:

- Tạo ra code loose coupling và high cohesion
- Dễ dàng test và mock các component
- Linh hoạt trong việc thay đổi implementation
- Tuân thủ các nguyên lý SOLID

Ví dụ từ hệ thống Class Section Management cho thấy cách áp dụng DI trong thực tế với Clean Architecture, giúp tạo ra một codebase maintainable và scalable.