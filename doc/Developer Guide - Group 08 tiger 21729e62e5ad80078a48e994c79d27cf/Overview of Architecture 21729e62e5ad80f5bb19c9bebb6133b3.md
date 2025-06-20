# Overview of Architecture

## **1. Giới thiệu**

---

- Hệ thống **Quản lý sinh viên** gồm hai thành phần chính: **Frontend** và **Backend**.
- **Backend** (Node.js/Express + MongoDB): Đảm nhiệm xử lý nghiệp vụ (business logic), quản lý truy xuất dữ liệu (data access), cung cấp API cho frontend qua RESTful.
- **Frontend** (Next.js/React): Đảm nhiệm giao diện người dùng (UI/UX), thực hiện các thao tác CRUD qua API, hiển thị dữ liệu và cung cấp trải nghiệm người dùng.

---

## **2. Kiến trúc hệ thống**

---

Ứng dụng tuân thủ mô hình **kiến trúc phân tán** (distributed architecture), tách biệt rõ ràng giữa tầng trình bày (presentation layer) và tầng xử lý nghiệp vụ (business logic layer). Điều này giúp tăng khả năng maintainability, scalability, testability và đảm bảo separation of concerns.

```markdown
+-------------------+         HTTP (RESTful API)         +-------------------+
|   Frontend (FE)   | <------------------------------->  |   Backend (BE)    |
|  Next.js / React  |                                    | Node.js / Express |
+-------------------+                                    +-------------------+
                                                                   |
                                                                   v
+-------------------+     +-------------------+     +-------------------+     +-------------------+     +-------------------+
|   Presentation,   |     |    Application    |     |      Domain       |     |  Infrastructure   |     |      Database     |
|   (controllers,   | --> |    (usecases,     | --> |     (entities,    | --> |  (repositories)   | --> |     (MongoDB)     |
|    middlewares,   |     |    validators)    |     |    repositories)  |     |                   |     |                   |
|    routes)        |     |                   |     |                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+     +-------------------+     +-------------------+
         |                          |                         |                         |                        |
         +-------------------------------------------------------------------------------------------------------+
                                                              |
                                                   +---------------------+
                                                   |       Shared        |
                                                   | (constants, types,  |
                                                   |       utils)        |
                                                   +---------------------+
```

Hệ thống bao gồm 2 project:

- **Frontend (FE)**: Xây dựng bằng Next.js/React, tổ chức theo hướng component, chia nhỏ UI, sử dụng service để gọi API.
- **Backend (BE)**: Xây dựng bằng Node.js/Express, tổ chức theo **Clean Architecture** với các tầng rõ ràng: Presentation, Application, Domain, Infrastructure, Shared.

Phía FE giao tiếp với phía BE thông qua giao thức HTTP (RESTful API).

---

## **3. Frontend (Next.js/React - Component-based Architecture)**

---

Frontend sử dụng kiến trúc component-based, tách biệt rõ ràng giữa UI, logic xử lý và gọi API.

### 3.1. Tổng quan các thành phần

**Components/Pages:**

- Hiển thị giao diện, nhận input từ người dùng, gọi API backend.
- Tổ chức lại UI thành các component nhỏ, dễ tái sử dụng.

**Service Layer:**

- Đóng gói các hàm gọi API, xử lý dữ liệu trước khi render.

**Hooks/Utils:**

- Xử lý logic tái sử dụng, validate dữ liệu, quản lý trạng thái.

### 3.2. Nguyên tắc kiến trúc

- **Separation of Concerns:** Tách biệt rõ giữa UI, logic xử lý và gọi API.
- **Reusable Components:** Xây dựng component tái sử dụng, dễ bảo trì.
- **State Management:** Sử dụng React state, context hoặc các thư viện quản lý state khi cần thiết.
- **Validation:** Kiểm tra dữ liệu đầu vào bằng Zup trước khi gửi lên backend.

---

## **4. Backend (Node.js/Express - Clean Architecture)**

---

Backend tuân theo các nguyên tắc của **Clean Architecture**, tổ chức code thành các lớp/tầng, với sự phụ thuộc hướng vào trong (business logic cốt lõi).

### 4.1. Tổng quan các layer

**Presentation Layer (Controllers):**

- Xử lý các request HTTP đến, xác thực, routing.
- Gọi usecase phù hợp để thực hiện business logic.
- Định dạng kết quả trả về cho client.

**Application Layer (Use cases/Services):**

- Chứa các quy tắc nghiệp vụ cốt lõi và logic ứng dụng.
- Điều phối luồng nghiệp vụ, xử lý logic chính.

**Domain Layer (Entities):**

- Định nghĩa các thực thể domain và business logic cốt lõi.
- Không phụ thuộc framework.

**Infrastructure Layer (Repositories, Database):**

- Kết nối MongoDB, triển khai repository, các dịch vụ ngoài.
- Thực thi các thao tác lưu trữ, truy xuất dữ liệu.

**Shared Layer:** 

- Chứa các tiện ích, constants, cấu hình dùng chung.

### 4.2. **Nguyên tắc & Best Practices**

- **Áp dụng Clean Architecture:** Tách biệt rõ các tầng Presentation, Application, Domain, Infrastructure, Shared.
- **Dependency Injection:** Sử dụng awilix để inject repository, usecase, controller tự động, giảm coupling, tăng testability.
- **Design Patterns:** Áp dụng Repository, Usecase, Singleton, Dependency Injection.
- **Tuân thủ SOLID:** Mỗi class chỉ làm một nhiệm vụ, dễ mở rộng, dễ test, dễ bảo trì.

---

## **5. Luồng giao tiếp**

---

### 5.1. Frontend tới Backend

1. Người dùng thao tác trên giao diện (Next.js/React).
2. Component gọi hàm service để gửi request API tới backend.
3. Backend controller nhận request, xác thực, gọi usecase xử lý nghiệp vụ.
4. Usecase thao tác với repository để truy xuất hoặc ghi dữ liệu vào MongoDB.
5. Kết quả trả về frontend, hiển thị cho người dùng.

### 5.2. Nội bộ Backend

1. Controller nhận request HTTP.
2. Gọi usecase/service phù hợp.
3. Usecase/service gọi repository để truy xuất dữ liệu.
4. Repository thao tác với MongoDB.
5. Dữ liệu trả về qua các tầng, cuối cùng trả response cho client.

---

## **6. Lợi ích của kiến trúc này**

---

- **Separation of Concerns:** Dễ bảo trì, dễ mở rộng, dễ cộng tác.
- **Testability:** Các tầng độc lập, dễ mock/test từng phần.
- **Replaceability:** Có thể thay thế từng thành phần (ví dụ: đổi database, đổi UI framework) mà không ảnh hưởng toàn hệ thống.
- **Scalability:** Dễ mở rộng chức năng, tăng trưởng hệ thống.
- **Parallel Development:** Frontend và backend phát triển độc lập, chỉ cần thống nhất API.
- **Modern Best Practices:** Dễ tiếp cận, dễ onboard thành viên mới.