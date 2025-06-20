# Unit Testing

## **1. Giới thiệu**

Unit Test là thành phần quan trọng trong phát triển phần mềm hiện đại, giúp phát hiện lỗi sớm, đảm bảo các chức năng nghiệp vụ hoạt động đúng, hỗ trợ refactor an toàn và nâng cao chất lượng sản phẩm. Trong hệ thống quản lý sinh viên của nhóm, unit test được sử dụng để kiểm thử các logic nghiệp vụ cốt lõi của backend Node.js (sử dụng Jest).

---

## **2. Tổng quan về thư mục test của project**

Toàn bộ unit test được đặt trong thư mục `usecases`, tổ chức theo từng domain/usecase của hệ thống:

```csharp
backend/
└── tests/
    └── usecases/
        ├── classSection/
        ├── course/
        ├── faculty/
        ├── log/
        ├── program/
        ├── registration/
        ├── setting/
        └── status
```

- Mỗi thư mục con chứa các file test cho từng usecase/service cụ thể (ví dụ: `UpdateCourseUseCase.test.js`, `DeleteFacultyUseCase.test.js`, ...).
- Các file test này kiểm thử các chức năng nghiệp vụ chính, validate dữ liệu, kiểm tra status code, và các trường hợp biên.

---

## **3. Quy tắc đặt tên và cách viết Unit Test**

### 3.1. Quy tắc đặt tên

**Thực tế trong project:**

- Tên file test đặt theo usecase/service, ví dụ: `UpdateCourseUseCase.test.js`, `DeleteFacultyUseCase.test.js`.
- Tên test case thường đặt theo dạng mô tả hành vi, ví dụ:
    - `should update course successfully`
    - `should throw error if course does not exist`
    - `should create registration successfully`
    - `should throw error if registration is invalid`

Cách đặt tên này phổ biến trong cộng đồng Node.js/Jest, tập trung vào kết quả mong đợi và tình huống kiểm thử.

---

## **4. Cách viết Unit Test trong project**

- Mỗi file test đều tạo các mock repository (bằng Jest), inject vào usecase/service qua constructor.
- Các dependency (repository, service phụ trợ) đều được mock để kiểm thử logic nghiệp vụ thuần, không phụ thuộc database.
- Các trường hợp test bao gồm: thành công, thất bại, validate dữ liệu, status code, exception.

**Ví dụ thực tế (Jest/Node.js):**

```jsx
it('should update course successfully', async () => {
  // Arrange
  courseRepositoryMock.findOneByCondition
    .mockResolvedValueOnce(null) // code check
    .mockResolvedValueOnce(null) // name check
    .mockResolvedValueOnce({ id: 'course-5', ... }); // id check
  facultyRepositoryMock.findOneByCondition.mockResolvedValue({ id: 'faculty-1' });
  courseRepositoryMock.update.mockResolvedValue({ id: 'course-5' });
  courseRepositoryMock.findAll.mockResolvedValue([ ... ]);
  const course = { id: 'course-5', code: 'NN001', ... };

  // Act & Assert
  await expect(useCase.execute(course)).resolves.toBeDefined();
});
```

- Cách viết test rõ ràng: chuẩn bị mock, gọi hàm, kiểm tra kết quả trả về.

---

## **5. Nội dung test các usecase/service**

---

- Kiểm tra các chức năng CRUD (Create, Read, Update, Delete) cho từng domain (course, classSection, faculty, registration, ...).
- Kiểm tra validate dữ liệu đầu vào (thiếu trường, sai kiểu, giá trị không hợp lệ...).
- Kiểm tra status code trả về đúng với logic thực tế (200, 400, 404...).
- Kiểm tra các trường hợp biên, logic nghiệp vụ đặc biệt (ví dụ: không cho xóa khi đang được sử dụng, validate trạng thái, ...).
- Đảm bảo các hàm mock được gọi đúng số lần, đúng tham số.

---

## **6. Kết luận**

Việc xây dựng unit test bài bản giúp hệ thống backend Node.js đảm bảo chất lượng, giảm thiểu lỗi khi phát triển và bảo trì. Các usecase/service cốt lõi đều được kiểm thử kỹ lưỡng, đảm bảo logic nghiệp vụ hoạt động đúng đắn, góp phần nâng cao độ tin cậy và khả năng mở rộng của toàn hệ thống.

---

**Tham khảo:**

- [Jest - Unit Testing Node.js](https://jestjs.io/docs/getting-started)
- [Best practices for writing unit tests](https://jestjs.io/docs/asynchronous)