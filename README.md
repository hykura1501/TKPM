## Project: Dự án quản lý danh sách sinh viên.

**Web demo**: [Student Management](https://fe-student-management.vercel.app/)

**Developer Guide**: [Click vào để xem tài liệu](https://www.notion.so/Developer-Guide-Group-08-tiger-21729e62e5ad80078a48e994c79d27cf)

# Cấu trúc Source Code của Dự án

## **Backend**

**Thư mục**: `/backend`  
**Mô tả**: Chứa mã nguồn xử lý logic phía server, được xây dựng theo kiến trúc Clean Architecture với Domain-Driven Design (DDD).

### **Các thư mục và tệp chính**:

#### **📁 `/src` - Mã nguồn chính**

##### **🏗️ `/application` - Tầng ứng dụng**
- **`/usecases`** - Chứa các use cases (business logic) của từng module:
  - `/classSection` - Xử lý logic cho lớp học
  - `/course` - Xử lý logic cho khóa học
  - `/faculty` - Xử lý logic cho khoa/phòng ban
  - `/log` - Xử lý logic cho hệ thống log
  - `/program` - Xử lý logic cho chương trình đào tạo
  - `/registration` - Xử lý logic cho đăng ký
  - `/semester` - Xử lý logic cho học kỳ
  - `/setting` - Xử lý logic cho cài đặt hệ thống
  - `/status` - Xử lý logic cho trạng thái
  - `/student` - Xử lý logic cho sinh viên
- **`/validators`** - Chứa các validator để kiểm tra dữ liệu đầu vào

##### **⚙️ `/configs` - Cấu hình hệ thống**
- **`/db`** - Cấu hình kết nối và thiết lập database

##### **🏛️ `/domain` - Tầng domain (nghiệp vụ)**
- **`/entities`** - Chứa các entity (thực thể) của hệ thống
- **`/repositories`** - Chứa các interface repository (abstract)

##### **🔧 `/infrastructure` - Tầng infrastructure**
- **`/repositories`** - Chứa implementation cụ thể của các repository

##### **🌐 `/presentation` - Tầng presentation**
- **`/controllers`** - Chứa các controller xử lý HTTP requests
- **`/middlewares`** - Chứa các middleware (authentication, validation, etc.)
- **`/routes`** - Chứa định nghĩa các API endpoints

##### **🛠️ `/shared` - Utilities chung**
- **`/utils`** - Chứa các utility functions dùng chung

#### **📋 `/docs` - Tài liệu dự án**
- Chứa documentation, API specs, và các tài liệu kỹ thuật

#### **🌱 `/seed` - Dữ liệu khởi tạo**
- **`/data`** - Chứa các file dữ liệu mẫu để seed database

#### **🧪 `/tests` - Test cases**
- **`/controllers`** - Test cho các controllers
- **`/services`** - Test cho các services
- **`/usecases`** - Test cho các use cases theo module:
  - `/classSection`, `/course`, `/faculty`, `/log`, `/program`
  - `/registration`, `/setting`, `/status`

---

## **Frontend**

**Thư mục**: `/frontend`  
**Mô tả**: Chứa mã nguồn giao diện người dùng, được xây dựng bằng Next.js với App Router và hỗ trợ đa ngôn ngữ (i18n).

### **Các thư mục và tệp chính**:

#### **📱 `/app` - App Router của Next.js**
- **`/students/new`** - Route cho tạo sinh viên mới
- **`/[locale]`** - Routes với hỗ trợ đa ngôn ngữ:
  - `/classes` - Quản lý lớp học
  - `/courses` - Quản lý khóa học
  - `/registration` - Quản lý đăng ký
  - `/settings` - Cài đặt hệ thống
  - `/students` - Quản lý sinh viên
  - `/transcripts` - Quản lý bảng điểm

#### **🎨 `/components` - Components tái sử dụng**
- **`/ui`** - Chứa các UI components cơ bản (buttons, forms, modals, etc.)

#### **⚙️ `/config` - Cấu hình ứng dụng**
- Chứa các file cấu hình cho frontend

#### **📊 `/data` - Dữ liệu tĩnh**
- Chứa mock data hoặc dữ liệu cấu hình

#### **📖 `/docs` - Tài liệu frontend**
- Documentation cho frontend

#### **🎣 `/hooks` - Custom React Hooks**
- Chứa các custom hooks để tái sử dụng logic

#### **📚 `/lib` - Libraries và utilities**
- Chứa các helper functions, API clients, và utilities

#### **🌍 `/messages` - Internationalization**
- Chứa các file ngôn ngữ cho đa ngôn ngữ

#### **🖼️ `/public` - Static assets**
- Chứa images, icons, fonts và các file tĩnh khác

#### **🔌 `/services` - API Services**
- Chứa các service để gọi API từ backend

#### **🎨 `/styles` - Stylesheets**
- Chứa CSS/SCSS files cho styling

#### **📝 `/types` - TypeScript Types**
- Chứa các type definitions cho TypeScript

---

## **Kiến trúc tổng thể**

### **Backend Architecture**: Clean Architecture + DDD
- **Domain Layer**: Entities và Repository interfaces
- **Application Layer**: Use cases và business logic
- **Infrastructure Layer**: Database implementation
- **Presentation Layer**: Controllers và HTTP handling

### **Frontend Architecture**: Next.js App Router
- **Component-based**: Tái sử dụng UI components
- **Service Layer**: API integration
- **Internationalization**: Hỗ trợ đa ngôn ngữ
- **Type Safety**: Full TypeScript support

### **Key Features**
- 🏫 **Quản lý giáo dục**: Students, Courses, Classes, Registration
- 🌍 **Đa ngôn ngữ**: Internationalization support
- 🔒 **Bảo mật**: Authentication & Authorization
- 📊 **Báo cáo**: Transcripts và analytics
- ⚡ **Performance**: Optimized với Next.js
- 🧪 **Testing**: Comprehensive test coverage

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

- Cập nhật khóa học:
<img width="1280" alt="Screenshot 2025-04-18 152539" src="https://github.com/user-attachments/assets/f58380bb-11d4-4f50-ac35-2247f38e3b82" />
<img width="1280" alt="Screenshot 2025-04-18 152601" src="https://github.com/user-attachments/assets/8d018666-bfcc-4ca9-80ad-4a1a7a263b10" />

- Xóa khóa học:
<img width="1280" alt="Screenshot 2025-04-18 152628" src="https://github.com/user-attachments/assets/fa90f2bd-4f0e-4f28-8b1b-58e7b8a9e1be" />

### Quản lý Lớp học
Giao diện trang Quản lý Lớp học:
<img width="1280" alt="Screenshot 2025-04-18 214353" src="https://github.com/user-attachments/assets/9d43f781-e6d9-42c4-83ad-85081ddbf73b" />

Tại trang Quản lý Lớp học, có các chức năng như:
- Tìm kiếm lớp học:
<img width="1280" alt="Screenshot 2025-04-18 213740" src="https://github.com/user-attachments/assets/2a62288f-1e5e-4c25-af57-2ff5e2589eb7" />

- Thêm lớp học:
<img width="1280" alt="Screenshot 2025-04-18 213948" src="https://github.com/user-attachments/assets/d0da3e09-777a-408b-bedc-17bd6d85ef0f" />
<img width="1279" alt="Screenshot 2025-04-18 214009" src="https://github.com/user-attachments/assets/96e704f4-649b-4cbf-94f6-041ebf277569" />

- Cập nhật Lớp học:
![Screenshot 2025-04-18 214935](https://github.com/user-attachments/assets/7c7d4577-7c98-4aa6-b1a6-ac64c794e61e)
![Screenshot 2025-04-18 214951](https://github.com/user-attachments/assets/a693c8d7-f9d9-469b-84fa-32fcf88473e5)

### Quản lý Sinh viên
Giao diện trang Quản lý Sinh viên:
![Screenshot 2025-04-18 215245](https://github.com/user-attachments/assets/d855a151-e05e-4b50-a6b2-a44401e6bf6f)

Tại trang Quản lý Sinh viên, có các chức năng như:
- Tìm kiếm sinh viên:
<img width="1280" alt="Screenshot 2025-04-18 220417" src="https://github.com/user-attachments/assets/fb8ddfa0-bbbc-4232-a053-5e0abadb881b" />

- Thêm sinh viên:
<img width="1280" alt="Screenshot 2025-04-18 220455" src="https://github.com/user-attachments/assets/3478935e-7c8e-494c-a335-6ce8de9535b9" />

- Cập nhật sinh viên:
<img width="1280" alt="Screenshot 2025-04-18 220540" src="https://github.com/user-attachments/assets/ccd51112-1f44-46cb-8797-370279c70cab" />

- Ngoài ra, còn có cấu hình để chỉnh sửa các định dạng thông tin của sinh viên như: Mã vùng số điện thoại, email, ...
<img width="1280" alt="Screenshot 2025-04-18 220704" src="https://github.com/user-attachments/assets/a811a28d-4bbe-42b2-a1ae-15e968a6420a" />

- Nhật ký để xem các sự thay đổi của sinh viên:
<img width="1280" alt="Screenshot 2025-04-18 220718" src="https://github.com/user-attachments/assets/abca7168-239b-42a6-a47c-3809a61a5ef8" />

- Cài đặt để thay đổi các thông tin Khoa, Tình trạng, Chương trình học:
<img width="1280" alt="Screenshot 2025-04-18 220733" src="https://github.com/user-attachments/assets/f004fcb4-aec2-4ca5-bd70-961855d57fea" />

### Đăng ký Khóa học
Giao diện trang Đăng ký Khóa học:
<img width="1280" alt="Screenshot 2025-04-18 214911" src="https://github.com/user-attachments/assets/6c2bdf13-eab3-4456-8d22-220f62cc1e1a" />

Tại trang Đăng ký Khóa học, có các chức năng như:
- Tìm kiếm sinh viên theo môn học:
<img width="1280" alt="Screenshot 2025-04-18 215212" src="https://github.com/user-attachments/assets/4f20718b-c9bd-4e9e-b749-b4e2a72adb42" />

- Đăng ký Khóa học:
<img width="1280" alt="Screenshot 2025-04-18 215234" src="https://github.com/user-attachments/assets/b8f84ebd-b571-489a-8c52-6a88407540c2" />
<img width="1280" alt="Screenshot 2025-04-18 215300" src="https://github.com/user-attachments/assets/0f4c2b57-028f-427b-84e4-d547e172b839" />

- Hủy đăng ký khóa học:
<img width="1280" alt="Screenshot 2025-04-18 215320" src="https://github.com/user-attachments/assets/067d146f-b812-4716-9056-7b8e245fd2eb" />

### Bảng điểm
![Screenshot 2025-04-18 224723](https://github.com/user-attachments/assets/187251f7-a37a-4043-a4ef-e05debaf8480)
![Screenshot 2025-04-18 224730](https://github.com/user-attachments/assets/2cc55fc0-150e-46bd-955b-4674f071a346)

## Tích hợp đa ngôn ngữ
Tiếp tục chuỗi đồ án của nhóm, nhóm đã bổ sung thêm hỗ trợ đa ngôn ngữ cho hệ thống. Hiện tại, hệ thống đã có sẵn 2 ngôn ngữ là tiếng Anh và tiếng Việt.

![image](https://github.com/user-attachments/assets/6ed12e4a-5338-4baa-9d67-b9f964ca81e4)
![image](https://github.com/user-attachments/assets/4771f2e6-1d87-4381-be63-c1082e30bde8)
![image](https://github.com/user-attachments/assets/2517ff08-1009-4e8f-93b1-15888afa58dc)
![image](https://github.com/user-attachments/assets/0fc5c911-6a03-462c-b8d9-45c3abcb81a1)
![image](https://github.com/user-attachments/assets/1882e520-9fb6-479e-8e91-1ab536d986f4)
![image](https://github.com/user-attachments/assets/1d35dc7c-12a1-4b7c-b308-54da02a9604d)

Có thể thấy rằng, toàn bộ giao diện trên hệ thống (so với hình ảnh giao diện mà nhóm cung cấp trong phần Các chức năng) đã có thể chuyển sang Anh-Việt một cách hợp lý.

### Việc tích hợp đa ngôn ngữ được thực hiện như thế nào?

#### Đối với các nội dung tĩnh

Nội dung tĩnh Là các chuỗi được viết cố định trong mã nguồn.

- Ví dụ: các nút "Lưu", "Hủy", "Đăng nhập thành công", "Lỗi hệ thống",...

Để tích hợp đa ngôn ngữ ở các nội dung tĩnh thì trong Front-end, nhóm sử dụng thư viện để tải file JSON tương ứng với ngôn ngữ.

- Tại file en.json:

`
{
  "save": "Save",
  "cancel": "Cancel",
  "login_success": "Login successful"
}
`

- Tại file vn.json:
  
`
{
  "save": "Lưu",
  "cancel": "Hủy",
  "login_success": "Đăng nhập thành công"
}
`

#### Các nội dung động

Nội dung động là dữ liệu lấy từ backend.

- Ví dụ: tên môn học, mô tả, tên lớp học,...

Để tích hợp đa ngôn ngữ ở các nội dung động thì trong cơ sở dữ liệu nhóm đã thiết kế field như sau: 

- Ví dụ dạng object với mã ngôn ngữ:
  
`
{
  vi: "Toán",
  en: "Math"
}
`

## Viết unit test cho các chức năng trong hệ thống:

Sau bài tập lần 5, nhóm đã thực hiện được đầy đủ tất cả các unit test. Tuy nhiên, sau khi tích hợp đa ngôn ngữ, một vài test không còn đảm bảo thực hiện được đúng. Do đó, nhóm đã thực hiện hiệu chỉnh, bổ sung lại unit test cho các controllers và services:

![image](https://github.com/user-attachments/assets/b845ad8d-635f-4d8b-a315-de7b80219958)

Ảnh trên chứng minh cho việc các unit test được thực hiện một cách đầy đủ và được kiểm tra lại kỹ càng. Qua đó, đảm bảo rằng các chức năng mà nhóm thực hiện cho ra kết quả đúng như mong đợi.

## Áp dụng các nguyên tắc Clean Code

Trong quá trình phát triển, nhóm cũng đã chú trọng áp dụng một số nguyên tắc Clean Code nhằm nâng cao chất lượng mã nguồn và đảm bảo khả năng bảo trì về sau. Một số điểm chính gồm:

- Đặt tên hàm và biến rõ ràng, dễ hiểu, phản ánh đúng chức năng (ví dụ: getListFaculties, addFaculty, updateFaculty).

- Tách logic xử lý ra khỏi controller, đưa vào service, tuân thủ nguyên tắc phân tách trách nhiệm (Single Responsibility Principle).

- Sử dụng try-catch để bắt lỗi và phản hồi rõ ràng về phía client, giúp dễ dàng debug và xử lý sự cố.

- Mã nguồn được định dạng đồng nhất, dễ đọc, giúp các thành viên trong nhóm dễ hiểu và làm việc chung hiệu quả hơn.

- Tiến hành refactor một số đoạn mã có dấu hiệu code smells.

Bài làm của nhóm luôn cố gắng để tuân thủ tốt các nguyên tắc viết mã sạch, góp phần nâng cao chất lượng tổng thể của hệ thống.Đồng thời, đảm bảo được tính nhất quán, tránh dư thừa các đoạn mã và giúp dễ dàng mở rộng về sau. 




