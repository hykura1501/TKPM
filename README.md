<img width="1280" alt="Screenshot 2025-04-18 152422" src="https://github.com/user-attachments/assets/5b3343ec-02b1-432e-8453-3bd1c1572aa0" />## Project Name
Dự án quản lý danh sách sinh viên.

**Web demo**: [Student Management](https://fe-student-management.vercel.app/)

## Cấu trúc source code
Dưới đây là mô tả các thư mục và tệp chính trong dự án:

### Frontend
**Thư mục**: `/frontend`

**Mô tả**: Chứa mã nguồn giao diện người dùng, được xây dựng bằng Next.js.

**Các thư mục và tệp chính**:
- `/src` - Chứa mã nguồn chính của ứng dụng, bao gồm các components, pages, và logic xử lý.
  - `/app` - Chứa các tệp liên quan đến routing và giao diện chính của ứng dụng.
  - `/components` - Chứa các thành phần UI tái sử dụng.
  - `/lib` - Chứa các tệp hỗ trợ, như kết nối API hoặc utilities.
- `/public` - Chứa các tệp tĩnh như hình ảnh, favicon, fonts.
- `package.json` - Danh sách các dependencies và scripts để chạy dự án.
- `tsconfig.json` - Cấu hình TypeScript cho dự án.
- `.env` - Chứa biến môi trường (nếu có sử dụng API hoặc database).

### Backend
**Thư mục**: `/backend`

**Mô tả**: Chứa mã nguồn xử lý logic phía server, được xây dựng bằng Node.js và Express.

**Các thư mục và tệp chính**:
- `/src` - Chứa mã nguồn chính, bao gồm các API, services, và cấu hình database.
  - `/api` - Chứa các controllers và services xử lý API.
    - `/controller` - Chứa các file điều khiển (controllers) để xử lý các yêu cầu từ client.
    - `/services` - Chứa các file xử lý logic nghiệp vụ (business logic) và giao tiếp với database.
    - `/routes` - Chứa các file định nghĩa các endpoint API.
    - `/model` - Chứa các định nghĩa mô hình dữ liệu.
    - `/configs` - Chứa các tệp cấu hình, như kết nối database.
- `package.json` - Danh sách các dependencies và scripts để chạy backend.
- `.env` - Chứa biến môi trường cho backend.

## Hướng dẫn cài đặt & chạy chương trình

### Yêu cầu môi trường
Trước khi chạy dự án, cần đảm bảo đã cài đặt:
- **Node.js** phiên bản 16 trở lên.
- **npm** (được cài đặt cùng với Node.js).

### Cài đặt dependencies
Di chuyển vào từng thư mục (`frontend` và `backend`), sau đó chạy lệnh sau để cài đặt các package cần thiết:

```sh
npm install
```

Lệnh này sẽ đọc file `package.json` và tải về tất cả các thư viện cần thiết cho dự án.

## Biên dịch
Next.js sử dụng TypeScript, vì vậy cần biên dịch mã TypeScript trước khi chạy bản production.

```sh
npm run build
```

Lệnh này sẽ tạo thư mục `.next` chứa phiên bản biên dịch của ứng dụng.

## Chạy chương trình

### Chạy Backend
Di chuyển vào thư mục `backend` và chạy lệnh:
```sh
npm run dev
```
Mặc định backend sẽ chạy tại **http://localhost:5000**.

### Chạy Frontend
Di chuyển vào thư mục `frontend` và chạy lệnh:
```sh
npm run dev
```
Mặc định frontend sẽ chạy tại **http://localhost:3000**.

## Ghi chú
- Đảm bảo `.env` được cấu hình đúng nếu có sử dụng biến môi trường.
- Backend cần khởi động trước frontend để đảm bảo kết nối API hoạt động chính xác.
- Quá trình chạy chương trình có thể mất một chút thời gian tùy vào cấu hình máy tính.

## Các chức năng

### Trang chủ
Giao diện trang chủ của hệ thống, gồm các nút để điều hướng sang các trang khác của hệ thống.
<img width="1280" alt="Screenshot 2025-04-18 151225" src="https://github.com/user-attachments/assets/00c9a697-eeef-47bf-94ac-fc2a21820dcc" />

### Quản lý Khóa học
Giao diện trang Quản lý Khóa học:
<img width="1280" alt="Screenshot 2025-04-18 151516" src="https://github.com/user-attachments/assets/1461cb3e-1e6c-4a33-b336-445dad118f52" />

Tại trang Quản lý Khóa học, có các chức năng như:
- Tìm kiếm khóa học
<img width="1280" alt="Screenshot 2025-04-18 212251" src="https://github.com/user-attachments/assets/8242c475-9bd6-4df9-aaca-7c84e2353ec4" />

- Thêm khóa học:
<img width="1280" alt="Screenshot 2025-04-18 152422" src="https://github.com/user-attachments/assets/c70e396a-663d-4595-98a8-476073c9fd5d" />
<img width="1280" alt="Screenshot 2025-04-18 152447" src="https://github.com/user-attachments/assets/2e75df56-8841-4508-85eb-41661a282b4a" />



### Quản lý Lớp học

### Quản lý Sinh viên

### Đăng ký Khóa học

### Bảng điểm

