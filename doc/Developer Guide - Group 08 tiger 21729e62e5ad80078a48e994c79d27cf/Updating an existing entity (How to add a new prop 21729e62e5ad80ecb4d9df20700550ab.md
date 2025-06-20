# Updating an existing entity (How to add a new property)

## **1. Giới thiệu**

---

- Tài liệu này mô tả quy trình thêm một thuộc tính mới (ví dụ: `description`) vào entity Faculty trong hệ thống **Quản Lý Sinh Viên**.
- Đối với các entity khác, khi cần thêm thuộc tính mới cũng thực hiện các thao tác tương tự.

## **2. Các bước thực hiện**

---

Chúng ta tiến hành thay đổi ở cả Backend, Frontend và Database.

### 2.1. Hệ thống Backend

**Cập nhật Data Model**

- **File thay đổi:** `Faculty.js`
- **Các bước thực hiện:**
    - Thêm trường mới vào schema:

```jsx
const FacultySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: Map, of: String, required: true },
  description: { type: String } // Thêm thuộc tính mới
});
```

**Cập nhật Validator**

- **File thay đổi:** `facultyValidator.js`
- **Các bước thực hiện:**
    - Thêm trường mới vào schema:

```jsx
const facultySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Tên khoa phải có ít nhất 3 ký tự' }),
  description: z.string().optional() // Thêm thuộc tính mới
});
```

**Cập nhật Controller/Service (nếu có validate hoặc mapping thủ công)**

- Đảm bảo các hàm tạo/sửa Faculty nhận và lưu `description`.

### 2.2. Hệ thống Frontend

**Cập nhật Model**

- **File thay đổi:** `student.ts`
- **Các bước thực hiện:**
    - Thêm trường mới vào type Faculty:

```tsx
export type Faculty = {
  id: string
  name: string
  description?: string // Thêm thuộc tính mới
}
```

**Cập nhật Form và UI liên quan**

- **File thay đổi:** (nếu có form nhập Faculty)
- **Các bước thực hiện:**
    - Thêm trường `description` vào form nhập liệu, table hiển thị, v.v.
    - Đảm bảo khi tạo/sửa Faculty sẽ gửi `description` lên backend.

### 2.3. Database Migration

- **Với MongoDB:** Không cần migration, chỉ cần thêm trường mới khi insert/update.