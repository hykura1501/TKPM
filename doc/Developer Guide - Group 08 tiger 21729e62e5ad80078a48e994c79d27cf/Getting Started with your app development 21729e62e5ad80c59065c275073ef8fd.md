# Getting Started with your app development

## **1. Giới thiệu**

---

Ứng dụng **Quản Lý Sinh Viên** được phát triển với Next.js (React, TypeScript) cho frontend và Node.js/Express cùng MongoDB cho backend. Đây là hướng dẫn cơ bản để developer có thể bắt đầu phát triển và kiểm thử hệ thống này.

## **2. Công cụ cần thiết**

---

- **Visual Studio Code** (khuyến nghị)
- **Node.js** phiên bản 16 trở lên
- **Quản lý package: v**ới backend dùng npm để quản lý package, với frontend dùng pnpm để quản lý package
- **MongoDB** (local hoặc cloud, ví dụ: MongoDB Atlas)
- **Trình duyệt web** (Chrome, Firefox, Edge, Safari)
- **GitHub** để quản lý phiên bản

---

## **3. Cài đặt & chạy chương trình**

---

### Bước 1: Clone mã nguồn dự án

Link repository: [Group06-Ex-TKPM](https://github.com/PhanPhuc269/Group06-Ex-TKPM)

```powershell
git clone <đường dẫn repository>
cd <tên-thư-mục-project>
```

### Bước 2: Cài đặt dependencies

- **Frontend:**

```powershell
cd frontend
pnpm i
```

- **Backend:**

```powershell
cd backend
npm i
```

### Bước 3: Cấu hình môi trường

- Tạo file `.env` trong thư mục `backend/` theo mẫu:

```
MONGODB_URI=<url connect data>
NODE_ENV=<development>
PORT=<port>
FRONTEND_URL=<url frontend 1>,<url frontend 2>
```

- Tạo file `.env` trong thư mục `frontend/` theo mẫu:

```
PORT=<port>
API_BASE_URL=<url backend>
```

### Bước 4: Khởi động dự án

- **Chạy MongoDB:** Đảm bảo MongoDB đã được khởi động (local hoặc cloud).
- **Chạy Backend:**

```
cd backend
npm run dev
```

(Mặc định backend chạy tại: http://localhost:5000)

- **Chạy Frontend:**

```
cd frontend
npm run dev
```

- (Mặc định frontend chạy tại: http://localhost:3000)

---

## **4. Kiểm tra dự án**

- Truy cập frontend qua trình duyệt tại `http://localhost:3000`.
- Thực hiện các chức năng như thêm, sửa, xóa, tìm kiếm sinh viên, lớp học, v.v.

---

## **5. Ghi chú**

- Đảm bảo file `.env` được cấu hình đúng.
- Khởi động backend trước frontend để đảm bảo frontend kết nối được API.
- Nếu gặp lỗi, kiểm tra lại log terminal hoặc liên hệ nhóm phát triển để được hỗ trợ.
- Trong quá trình khởi chạy, đôi khi sẽ tốn chút thời gian.