# Developer Guide for Student Management Frontend

## 1. Coding Standards
- Sử dụng camelCase cho biến, PascalCase cho component/class, UPPER_CASE cho hằng số.
- Ưu tiên function component và React hooks.
- Đặt tên file, thư mục rõ ràng, nhất quán (component PascalCase, hook camelCase).
- Sử dụng Prettier và ESLint để đảm bảo format code nhất quán.
- Không hard-code text, sử dụng i18n cho đa ngôn ngữ.

## 2. Overview of Architecture
- Ứng dụng tổ chức theo hướng separation of concerns:
  - `components/`: Component UI, chia nhỏ theo chức năng.
  - `hooks/`: Custom React hooks.
  - `lib/`: Hàm tiện ích, API client, logging, v.v.
  - `services/`: Tầng giao tiếp API, tách biệt logic gọi API khỏi component.
  - `config/`: Cấu hình route, các thông số chung.
  - `types/`: Định nghĩa type, interface cho TypeScript.
  - `app/`: Entry point, layout, page, loading, middleware.
  - `messages/`: File đa ngôn ngữ.
  - `public/`: Ảnh, tài nguyên tĩnh.
  - `styles/`: CSS, Tailwind, module CSS.

## 3. Source Code Organization
```
frontend/
  app/
  components/
    ui/
  config/
  data/
  hooks/
  lib/
  messages/
  public/
  services/
  styles/
  types/
  ...
```

## 4. Getting Started with App Development
- Cài đặt Node.js >= 16, pnpm.
- Chạy `pnpm install` để cài dependencies.
- Tạo file `.env.local` nếu cần cấu hình riêng.
- Chạy `pnpm dev` để khởi động frontend.
- Truy cập `http://localhost:3000`.

## 5. Database Schema
- Frontend không thao tác trực tiếp với database, chỉ làm việc với API và các type/interface trong `types/`.

## 6. Updating an Existing Entity (How to add a new property)
- Cập nhật type/interface trong `types/`.
- Cập nhật các service, component, form liên quan.
- Đảm bảo validate dữ liệu đầu vào nếu có.

## 7. Registering New Routes
- Thêm file page mới trong `app/` hoặc cập nhật `config/routes.js`.
- Đảm bảo route mới có layout, bảo vệ route nếu cần (middleware).

## 8. Inversion of Control and Dependency Injection
- Sử dụng context/provider để inject dependency (nếu có).
- Ưu tiên truyền dependency qua props hoặc context thay vì import trực tiếp.

## 9. Data Validation
- Sử dụng schema validation (yup, zod) cho form.
- Hiển thị lỗi rõ ràng cho người dùng.

## 10. Exposing and Handling Events
- Sử dụng context hoặc event emitter cho các sự kiện toàn cục (nếu cần).
- Ưu tiên truyền callback qua props cho component con.

## 11. Settings API
- Giao tiếp với API cấu hình qua `services/settingServices.ts`.
- Lưu cấu hình vào context hoặc state toàn cục nếu cần.

## 12. Unit Testing
- Viết test cho component, hook, service (nếu có).
- Sử dụng Jest, React Testing Library.

## 13. How to Write a Plugin for Your App (nếu có)
- Định nghĩa interface cho plugin.
- Đăng ký plugin qua context/provider hoặc dynamic import.

## 14. Web API Documentation
- Tham khảo tài liệu API backend (Swagger).
- Đảm bảo các service gọi đúng endpoint, truyền đúng tham số.

---

## Ghi chú
- Luôn tuân thủ coding standards, separation of concerns.
- Khi thêm/chỉnh sửa tính năng, cập nhật type, test, tài liệu liên quan.
- Sử dụng i18n cho mọi text hiển thị.
