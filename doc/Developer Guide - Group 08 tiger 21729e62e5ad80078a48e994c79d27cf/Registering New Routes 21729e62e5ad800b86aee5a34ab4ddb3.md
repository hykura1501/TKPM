# Registering New Routes

## **1. Giới thiệu**

---

Trong ứng dụng Next.js, **route** là cách ánh xạ một URL cụ thể đến một **component** hoặc **page** tương ứng. Việc đăng ký route mới cho phép bạn mở rộng ứng dụng bằng cách thêm các trang mới, giúp người dùng dễ dàng điều hướng và tương tác.

## **2. Route Structure**

---

**`app/` Directory**

Thư mục **app/** là nơi chính để định nghĩa các route cho ứng dụng. Mỗi thư mục hoặc file trong **app/** (trừ các file đặc biệt như `layout.tsx`, `page.tsx`, `loading.tsx`) sẽ tự động trở thành một route.

- **page.tsx**: Mỗi file `page.tsx` trong một thư mục con của `app/` sẽ tương ứng với một route.
- **layout.tsx**: Định nghĩa bố cục (layout) cho các route con.
- **[locale]/**: Thư mục động cho đa ngôn ngữ, ví dụ `/en`, `/vi`.

**Ví dụ cấu trúc:**

```csharp
app/
  page.tsx           // route: "/"
  [locale]/
    page.tsx         // route: "/en", "/vi", ...
    about/
      page.tsx       // route: "/en/about", "/vi/about", ...
```

**`components/` Directory**

Các component dùng lại (như sidebar, header, form, ...) được đặt trong thư mục `components/` và được import vào các page khi cần.

## **3. Đăng ký Routes mới cho frontend**

---

### **3.1. Đăng ký tuyến đường mới cho frontend**

Để thêm một route mới, bạn thực hiện các bước sau:

- **Tạo thư mục mới trong `app/`**:
    - Ví dụ: muốn tạo trang quản lý giáo viên, tạo thư mục `teachers/` trong `app/` (hoặc `app/[locale]/teachers/` nếu dùng đa ngôn ngữ).
- **Tạo file `page.tsx` trong thư mục vừa tạo**:
    - Đây là file định nghĩa nội dung cho route mới.
- **(Tuỳ chọn) Thêm liên kết điều hướng**:
    - Thêm một link mới trong component điều hướng (ví dụ: `app-sidebar.tsx` hoặc `header.tsx`) để người dùng có thể truy cập trang mới.

### **3.2. (Tùy chọn)Thêm liên kết điều hướng**

---

Giả sử bạn muốn thêm một trang mới để quản lý giáo viên, thực hiện như sau:

- **Tạo thư mục và file mới:**
    - Tạo `app/teachers/page.tsx` (hoặc `app/[locale]/teachers/page.tsx` nếu dùng đa ngôn ngữ).
    - Nội dung ví dụ cho `page.tsx`:

```tsx
// app/teachers/page.tsx
export default function TeachersPage() {
  return <div>Quản lý giáo viên</div>;
}
```

**Thêm liên kết trong sidebar hoặc header:**

- Mở file `components/app-sidebar.tsx` hoặc `components/header.tsx`, thêm:

```tsx
<Link href="/teachers">Giáo viên</Link>
```

- Nếu dùng đa ngôn ngữ, link có thể là:

```tsx
<Link href={`/${locale}/teachers`}>Giáo viên</Link>
```

## **4. Đăng ký Routes mới cho backend**

---

### 4.1. **Tạo file route mới trong thư mục `routes/`**

Ví dụ: Tạo file example.js trong routes

---

```jsx
const express = require('express');
const router = express.Router();
const container = require('../../container');
const exampleController = container.resolve('exampleController');

// Định nghĩa endpoint GET
router.get('/', (req, res) => exampleController.getExample(req, res));

// Có thể thêm các endpoint khác (POST, PUT, DELETE) tại đây

module.exports = router;
```

### 2. **Tạo hoặc cập nhật controller tương ứng trong `controllers/`**

Ví dụ: Tạo file `ExampleController.js` trong controllers

```jsx
class SettingController {
  constructor({
		// Tham số đầu vào là các usecase cần sử dụng
		exampleUsecase
  }) {
    this.exampleUsecase = exampleUsecase;
  }

  async getExample(req, res) {
    // Xử lý logic ở đây, có thể gọi usecase/service
    // Cách gọi this.exampleUsecase.execute(Tham số cần thiết)
    res.json({ message: "Hello from example route!" });
  }
}

module.exports = ExampleController;
```

---

### 3. **Đăng ký controller vào DI container nếu sử dụng `awilix`, tại `container.js`**

Trong container.js

```jsx
const ExampleController = require('./presentation/controllers/ExampleController');
// ...existing code...
container.register({
  // ...existing registrations...
  exampleController: asClass(ExampleController).scoped(),
});
```

---

### 4. **Đăng ký route vào router tổng tại `index.js`**

Trong index.js

const exampleRoute = require('./example');

```jsx
const exampleRoute = require('./example');
// ...existing code...
function router(app) {
  // ...existing routes...
  app.use('/api/example', exampleRoute);
}
module.exports = router;
```

---

### 5. **Khởi động lại server và kiểm tra**

Truy cập `http://localhost:PORT/api/example` để kiểm tra route mới đã hoạt động.