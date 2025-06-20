# Data Validation

## **1. Giới thiệu**

---

- Data Validation (xác thực dữ liệu) là bước quan trọng giúp đảm bảo dữ liệu người dùng nhập vào hệ thống là hợp lệ, nhất quán và an toàn trước khi lưu trữ hoặc xử lý. Trong dự án quản lý sinh viên, xác thực dữ liệu giúp ngăn chặn lỗi logic, bảo vệ hệ thống khỏi dữ liệu không hợp lệ hoặc độc hại, đồng thời nâng cao trải nghiệm người dùng.
- Trong dự án này, cơ chế xác thực dữ liệu được triển khai ở cả frontend (Next.js) và backend (Node.js/Express), giúp kiểm soát chất lượng dữ liệu xuyên suốt quá trình xử lý.

## **2. Data Validation ở frontend (Next.js/React)**

---

### 2.1. Tổng quan

Ở phía Frontend, xác thực dữ liệu được thực hiện trực tiếp trên trình duyệt, giúp phát hiện lỗi sớm và cung cấp phản hồi tức thì cho người dùng. Với dự án này thường được thực hiện bằng thư viện `zod` kết hợp với các thư viện quản lý form như React Hook Form.

### 2.2. Ví dụ sử dụng Zod với React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  id: z.string()
    .regex(/^\d{8}$/, { message: "Mã sinh viên phải gồm 8 chữ số" })
    .nonempty("Bắt buộc nhập mã sinh viên"),
  fullName: z.string()
    .max(100, "Tên không quá 100 ký tự")
    .nonempty("Bắt buộc nhập họ tên"),
  dateOfBirth: z.coerce.date({ required_error: "Bắt buộc nhập ngày sinh" }),
  // ... các trường khác
});

export default function StudentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  // ...existing code...
}
```

**Giải thích:**

- **`schema`**: Định nghĩa các quy tắc kiểm tra dữ liệu cho từng trường.
- **`useForm` +** `zodResolver`: Kết hợp React Hook Form với Yup để tự động kiểm tra dữ liệu khi người dùng nhập.
- Khi người dùng nhập sai, **thông báo lỗi sẽ hiển thị ngay dưới trường nhập liệu**.
- Khi submit hợp lệ, **dữ liệu sẽ được xử lý tiếp** (ví dụ: gửi lên backend).

### 2.3. Ưu điểm

- Phản hồi lỗi ngay lập tức cho người dùng.
- Giảm số lượng request không hợp lệ gửi lên server.
- Cải thiện trải nghiệm người dùng.

**Lưu ý:** Validation ở frontend chỉ hỗ trợ, không thay thế cho validation ở backend.

## **3. Data Validation ở backend (Node.js/Express)**

---

### 3.1. Tổng quan

Ở phía Backend, xác thực dữ liệu đảm bảo mọi dữ liệu nhận từ client đều hợp lệ trước khi xử lý nghiệp vụ hoặc lưu vào database. Trong dự án này, nhóm sử dụng thư viện `zod` để định nghĩa schema và kiểm tra dữ liệu.

### 3.2. Hướng dẫn viết và dùng Validator trong dự án

- Đầu tiên tạo file validator theo quy tắt đặt tên vào thư mục `src/application/validators/`

```jsx
// src/application/validators/studentValidator.js
const z = require('zod');

const studentSchema = z.object({
  id: z.string().regex(/^\d{8}$/, { message: "Mã sinh viên phải gồm 8 chữ số" }),
  fullName: z.string().max(100, { message: "Tên không quá 100 ký tự" }),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Ngày sinh không hợp lệ" }),
  // ... các trường khác
});

module.exports = { studentSchema };
```

- Ví dụ cho việc sử dụng Validator

```tsx
// Use case: Create a new student
const { studentSchema } = require("@validators/studentValidator");

// ...
async execute(programData, language = "vi") {
		// Validate schema
    const parsed = studentSchema.safeParse(studentData);
    if (!parsed.success) {
		//	...
      throw { status: 400, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    // ...
}
```

**Giải thích:**

- **`studentSchema`**: Định nghĩa các quy tắc kiểm tra dữ liệu cho từng trường bằng Zod.
- **`safeParse`**: Kiểm tra dữ liệu, trả về kết quả thành công hoặc lỗi chi tiết.
- Nếu dữ liệu không hợp lệ, trả về lỗi 400 kèm chi tiết lỗi cho client.
- Nếu hợp lệ, tiếp tục xử lý (ví dụ: lưu vào database).

### 3.3. Ưu điểm

- Đảm bảo dữ liệu lưu vào hệ thống luôn đúng và nhất quán.
- Bảo vệ hệ thống khỏi dữ liệu độc hại.
- Hỗ trợ kiểm tra logic phức tạp, đảm bảo tính toàn vẹn nghiệp vụ.
- Zod có cú pháp TypeScript thân thiện, dễ tích hợp với các dự án hiện đại.

---

## **4. Lợi ích của Data Validation**

---

- **Đơn giản, dễ dùng:** Có thể sử dụng các thư viện phổ biến, dễ tích hợp.
- **Nhất quán:** Quy tắc kiểm tra dữ liệu được định nghĩa tập trung, dễ bảo trì.
- **Bảo mật:** Ngăn chặn dữ liệu không hợp lệ hoặc độc hại.

---

## **5. Kết luận**

---

- Data validation là lớp bảo vệ quan trọng ở cả frontend lẫn backend, giúp hệ thống vận hành ổn định, bảo mật và thân thiện với người dùng.
- Kết hợp validation ở cả hai phía là giải pháp tối ưu để xây dựng ứng dụng hiện đại, chắc chắn và dễ bảo trì.

---

**Tham khảo thêm:**

- [Zod Documentation.](https://zod.dev/)