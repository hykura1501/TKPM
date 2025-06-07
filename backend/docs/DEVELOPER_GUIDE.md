# Developer Guide for Student Management System

## 1. Coding Standards
- Sử dụng camelCase cho biến, PascalCase cho class/component, UPPER_CASE cho hằng số.
- Đặt tên file, thư mục rõ ràng, nhất quán (component PascalCase, hook camelCase).
- Sử dụng Prettier và ESLint để đảm bảo format code nhất quán.
- Không hard-code text, sử dụng i18n cho đa ngôn ngữ.
- Ưu tiên function component và React hooks (frontend).
- Không lặp code, tách logic dùng lại thành hook, service, helper.

## 2. Overview of Architecture
- Áp dụng Clean Architecture: tách biệt rõ các tầng Presentation, Application, Domain, Infrastructure, Shared.
- Sử dụng Dependency Injection (awilix) để inject repository, usecase, controller tự động.
- Áp dụng các Design Patterns: Repository, Usecase, Singleton, Dependency Injection.
- Tuân thủ SOLID: mỗi class chỉ làm một nhiệm vụ, dễ mở rộng, dễ test, dễ bảo trì.

## 3. Source Code Organization
```
backend/
  src/
    api/                # Legacy code, sẽ dần loại bỏ
    application/
      usecases/         # Các usecase (business logic)
      validators/       # Schema validation (zod/yup)
    configs/            # Cấu hình DB, i18n, ...
    domain/
      entities/         # Entity thuần (không phụ thuộc ORM)
      repositories/     # Interface repository
    infrastructure/
      repositories/     # Triển khai repository (DB, ORM)
    presentation/
      controllers/      # Controller nhận request, gọi usecase
      middlewares/      # Middleware (auth, language, ...)
      routes/           # Định nghĩa route, mapping controller
    shared/
      utils/            # Helper, logging, tiện ích dùng chung
      constants/
      types/
  tests/                # Unit test
  seed/                 # Script seed dữ liệu
frontend/
  ...                   # Tổ chức theo chuẩn Next.js/React
```

## 4. Getting Started with App Development
- Yêu cầu: Node.js >= 16, pnpm, MongoDB.
- Cài đặt:
  ```sh
  pnpm install
  ```
- Cấu hình:
  - Tạo file `.env` với các biến môi trường cần thiết (DB, PORT, ...).
- Chạy ứng dụng:
  ```sh
  pnpm dev
  ```
- Truy cập:
  - Backend: `http://localhost:3000`
  - Frontend: `http://localhost:3000` (Next.js)

## 5. Database Schema
- Backend không thao tác trực tiếp với DB trong controller/usecase.
- Tất cả truy cập DB đều qua repository (infrastructure).
- Entity thuần định nghĩa ở `domain/entities/`.
- Khi thay đổi schema, cập nhật entity, repository, validator, test.

## 6. Updating an Existing Entity (How to add a new property)
1. Cập nhật entity trong `domain/entities/`.
2. Cập nhật schema validation trong `application/validators/`.
3. Cập nhật repository (nếu cần).
4. Cập nhật usecase, controller, test liên quan.

## 7. Registering New Routes
- Thêm file route mới trong `presentation/routes/`.
- Đăng ký controller tương ứng trong DI container (`src/container.js`).
- Đảm bảo controller chỉ gọi usecase, không gọi repository trực tiếp.
- Cập nhật middleware nếu cần bảo vệ route.

## 8. Inversion of Control and Dependency Injection
- Sử dụng DI container (awilix) để inject repository, usecase, controller tự động.
- Controller nhận dependency qua constructor, không import trực tiếp.
- Lợi ích: Dễ test, dễ mock, dễ mở rộng, giảm coupling.

## 9. Data Validation
- Sử dụng zod/yup đặt tại `application/validators/`.
- Validate dữ liệu đầu vào ở usecase hoặc middleware.
- Trả lỗi rõ ràng cho client.

## 10. Exposing and Handling Events
- Sử dụng event emitter hoặc pub/sub nếu cần xử lý sự kiện toàn cục (ví dụ: log, notification).
- Đặt logic event ở `shared/utils/` hoặc `domain/services/`.

## 11. Settings API
- Giao tiếp với API cấu hình qua repository và usecase.
- Lưu cấu hình vào context hoặc state toàn cục nếu cần (frontend).

## 12. Unit Testing
- Viết test cho repository, usecase, controller.
- Đặt test trong thư mục `tests/`.
- Sử dụng Jest, Supertest (backend), React Testing Library (frontend).

## 13. How to Write a Plugin for Your App (nếu có)
- Định nghĩa interface cho plugin ở `domain/`.
- Đăng ký plugin qua DI container hoặc dynamic import.
- Đảm bảo plugin không phá vỡ kiến trúc tổng thể.

## 14. Web API Documentation
- Đảm bảo tất cả endpoint RESTful, trả về status code và message rõ ràng.
- Có thể tích hợp Swagger/OpenAPI cho backend.
- Đặt tài liệu API ở `docs/` hoặc tự động sinh từ code.

---

## Ghi chú
- Luôn tuân thủ coding standards, separation of concerns.
- Khi thêm/chỉnh sửa tính năng, cập nhật type, test, tài liệu liên quan.
- Sử dụng i18n cho mọi text hiển thị.
- Ưu tiên DI container cho mọi dependency.

---

**Tham khảo thêm:**
- [nopCommerce Developer Docs](https://docs.nopcommerce.com/en/developer/index.html)
- [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)
- [awilix DI container](https://github.com/jeffijoe/awilix)
