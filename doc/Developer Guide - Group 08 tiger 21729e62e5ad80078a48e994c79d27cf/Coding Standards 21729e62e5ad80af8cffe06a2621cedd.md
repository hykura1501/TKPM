# Coding Standards

## **1. Giới thiệu**

---

Hệ thống **Quản Lý Sinh Viên** tuân thủ các quy tắc sau để đảm bảo mã nguồn nhất quán, dễ đọc, dễ bảo trì và phù hợp với chuẩn cộng đồng Node.js/TypeScript/React:

- **Language Convention (Quy ước ngôn ngữ):** Tuân thủ chuẩn ES6+, TypeScript, React.
- **Formatting Conventions (Định dạng):** Định dạng mã nguồn nhất quán, rõ ràng.
- **Naming Conventions (Quy tắc đặt tên):** Đặt tên biến, hàm, class, file… theo quy tắc thống nhất.

---

## **2. Language Convention (Quy ước ngôn ngữ)**

---

### 2.1. Sử dụng ES6+ và TypeScript

- **Quy tắc:** Luôn sử dụng cú pháp ES6+ (let/const, arrow function, destructuring, spread, v.v.) và tận dụng TypeScript để kiểm soát kiểu dữ liệu.

**✅ Code đúng:**

```tsx
const sum = (a: number, b: number): number => a + b;

interface Student {
  id: string;
  fullName: string;
}
```

**❌ Code sai:**

```jsx
var sum = function(a, b) { return a + b; }

function Student(id, fullName) {
  this.id = id;
  this.fullName = fullName;
}
```

### 2.2. Xử lý bất đồng bộ với async/await

- **Quy tắc:** Luôn dùng async/await cho các thao tác bất đồng bộ (API, DB, v.v.), không dùng callback hoặc promise chaining.

**✅ Code đúng:**

```jsx
const students = await studentService.getAll();
```

**❌ Code sai:**

```jsx
studentService.getAll().then(students => { ... });
```

### 2.3. Xử lý lỗi rõ ràng

- **Quy tắc:** Sử dụng try-catch cho các thao tác bất đồng bộ, trả về thông báo lỗi rõ ràng.

**✅ Code đúng:**

```tsx
try {
  const student = await studentService.getById(id);
  if (!student) throw new Error("Student not found");
} catch (error) {
  console.error(error);
}
```

**❌ Code sai:**

```tsx
const student = await studentService.getById(id);
// Không kiểm tra lỗi, không try-catch
```

---

## **3. Formatting Conventions (Định dạng)**

---

### 3.1. Dấu ngoặc nhọn (Brace Style)

- **Quy tắc:** Dấu ngoặc nhọn mở trên dòng mới (Allman style hoặc K&R style đều được, nhưng phải nhất quán).

**✅ Code đúng:**

```tsx
function foo() {
  // code
}
```

**❌ Code sai:**

```tsx
function foo()
{ 
  // code
}
```

---

### 3.2. Control Flow Statements

- **Quy tắc:** else, catch, finally phải trên dòng mới.

**✅ Code đúng:**

```tsx
if (error) {
  // ...
} else {
  // ...
}
```

**❌ Code sai:**

```tsx
if (error) {
  // ...
} else { // Không xuống dòng
  // ...
}
```

### 3.3. Spacing Rules

- **Quy tắc:** Sử dụng khoảng trắng hợp lý trong khai báo và biểu thức.

**✅ Code đúng:**

```tsx
const total = a + b;
function getStudent(id: string) { ... }
```

**❌ Code sai:**

```
const total=a+b;
function getStudent( id : string ){...}
```

### 3.4. Line Wrapping

- **Quy tắc:** Mỗi statement trên một dòng riêng.

**✅ Code đúng:**

```tsx
const a = 1;
const b = 2;
```

**❌ Code sai:**

```tsx
const a = 1; const b = 2;
```

## **4. Naming Conventions (Quy tắc đặt tên)**

---

### 4.1. Biến, hàm, thuộc tính: camelCase

**✅ Code đúng:**

```tsx
const studentList = [];
function getStudentName() { ... }
```

**❌ Code sai:**

```tsx
const Student_List = [];
function Get_Student_Name() { ... }
```

---

### 4.2. Class, Interface, Enum: PascalCase

**✅ Code đúng:**

```tsx
class StudentService { ... }
interface Student { ... }
enum UserRole { Admin, User }
```

**❌ Code sai:**

```tsx
class student_service { ... }
interface i_student { ... }
enum user_role { admin, user }
```

---

### 4.3. Hằng số: SNAKE_UPPER_CASE

**✅ Code đúng:**

```
export const API_BASE_URL = "/api";
```

**❌ Code sai:**

```tsx
export const apiBaseUrl = "/api";
```

---

### 4.4. File & Folder: kebab-case hoặc camelCase (chọn 1, nên dùng kebab-case cho Next.js)

**✅ Code đúng:**

```
student-form.tsx
course-management.tsx
```

**❌ Code sai:**

```tsx
StudentForm.tsx
Course_Management.tsx
```

---

### 4.5. Service/Model Classes: Hậu tố Service/Model

**✅ Code đúng:**

```tsx
class StudentService { ... }
class StudentModel { ... }
```

**❌ Code sai:**

```tsx
class StudentSVC { ... }
class StudentMDL { ... }
```

---

### 4.6. Type Generics: Một chữ cái hoặc PascalCase bắt đầu bằng T

**✅ Code đúng:**

```tsx
type ApiResponse<T>
interface Repository<TModel>
```

**❌ Code sai:**

```tsx
type ApiResponse<Type>
interface Repository<Model>
```

---

## **5. Một số lưu ý khác**

- Sử dụng Prettier và ESLint để tự động kiểm tra và định dạng code.
- Comment rõ ràng, ngắn gọn, ưu tiên tiếng Anh cho codebase quốc tế hóa.
- Không commit code chưa format hoặc có warning/error ESLint.