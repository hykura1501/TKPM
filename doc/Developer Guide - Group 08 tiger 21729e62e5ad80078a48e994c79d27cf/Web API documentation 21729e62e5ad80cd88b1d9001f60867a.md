# Web API documentation

## Tổng quan

---

## 1. API Quản lý Khóa học (Course)

### 1.1 Lấy danh sách khóa học

**Mô tả:** Lấy toàn bộ danh sách khóa học trong hệ thống

**Endpoint:** `GET /course`

**Headers:**

```json
{
  "Accept-Language": "vi" // hoặc "en"
}
```

**Query Parameters:** Không có

**Ví dụ Request:**

```bash
GET /api/course
Accept-Language: vi
```

**Response thành công (200):**

```json
[
  {
    "id": 1,
    "code": "CS101",
    "name": "Lập trình cơ bản",
    "description": "Khóa học giới thiệu về lập trình",
    "credits": 3,
    "faculty": 1,
    "isActive": true,
    "createdAt": "2024-01-15T08:30:00Z",
    "updatedAt": "2024-01-15T08:30:00Z"
  },
  {
    "id": 2,
    "code": "MATH201",
    "name": "Toán cao cấp",
    "description": "Khóa học toán học nâng cao",
    "credits": 4,
    "faculty": 2,
    "isActive": true,
    "createdAt": "2024-01-16T09:00:00Z",
    "updatedAt": "2024-01-16T09:00:00Z"
  }
]
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy danh sách khoa"
}
```

---

### 1.2 Thêm khóa học mới

**Mô tả:** Tạo một khóa học mới trong hệ thống

**Endpoint:** `POST /course`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Request Body:**

```json
{
  "code": "ENG301",
  "name": "Tiếng Anh chuyên ngành",
  "description": "Khóa học tiếng Anh dành cho sinh viên kỹ thuật",
  "credits": 3,
  "faculty": 3
}
```

**Response thành công (201):**

```json
{
  "success": true,
  "message": "Thêm khóa học thành công",
  "courses": [
    {
      "id": 3,
      "code": "ENG301",
      "name": "Tiếng Anh chuyên ngành",
      "description": "Khóa học tiếng Anh dành cho sinh viên kỹ thuật",
      "credits": 3,
      "faculty": 3,
      "isActive": true,
      "createdAt": "2024-01-17T10:15:00Z",
      "updatedAt": "2024-01-17T10:15:00Z"
    }
  ]
}
```

**Response lỗi (400) - Validation:**

```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["code"],
      "message": "Required"
    }
  ]
}
```

**Response lỗi (400) - Mã khóa học đã tồn tại:**

```json
{
  "error": "Mã khóa học đã tồn tại"
}
```

**Response lỗi (400) - Khoa không tồn tại:**

```json
{
  "error": "Khoa phụ trách không tồn tại"
}
```

---

### 1.3 Cập nhật khóa học

**Mô tả:** Cập nhật thông tin của một khóa học hiện có

**Endpoint:** `PUT /course`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Request Body:**

```json
{
  "id": 3,
  "code": "ENG301",
  "name": "Tiếng Anh chuyên ngành nâng cao",
  "description": "Khóa học tiếng Anh nâng cao dành cho sinh viên kỹ thuật",
  "credits": 4,
  "faculty": 3
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cập nhật khóa học thành công",
  "courses": [
    {
      "id": 3,
      "code": "ENG301",
      "name": "Tiếng Anh chuyên ngành nâng cao",
      "description": "Khóa học tiếng Anh nâng cao dành cho sinh viên kỹ thuật",
      "credits": 4,
      "faculty": 3,
      "isActive": true,
      "createdAt": "2024-01-17T10:15:00Z",
      "updatedAt": "2024-01-17T11:30:00Z"
    }
  ]
}
```

**Response lỗi (404):**

```json
{
  "error": "Khóa học không tồn tại"
}
```

**Response lỗi (400):**

```json
{
  "error": "Cập nhật khóa học không hợp lệ"
}
```

---

### 1.4 Xóa khóa học

**Mô tả:** Xóa một khóa học khỏi hệ thống. Nếu khóa học đang được sử dụng, sẽ vô hiệu hóa thay vì xóa

**Endpoint:** `DELETE /course/{id}`

**Headers:**

```json
{
  "Accept-Language": "vi"
}
```

**Path Parameters:**

- `id` (integer): ID của khóa học cần xóa

**Ví dụ Request:**

```bash
DELETE /api/course/3
Accept-Language: vi
```

**Response thành công (200) - Xóa hoàn toàn:**

```json
{
  "success": true,
  "message": "Xóa khóa học thành công",
  "courses": [
    {
      "id": 1,
      "code": "CS101",
      "name": "Lập trình cơ bản",
      "description": "Khóa học giới thiệu về lập trình",
      "credits": 3,
      "faculty": 1,
      "isActive": true
    }
  ]
}
```

**Response thành công (200) - Vô hiệu hóa:**

```json
{
  "success": true,
  "message": "Khóa học đã được vô hiệu hóa",
  "courses": [
    {
      "id": 3,
      "code": "ENG301",
      "name": "Tiếng Anh chuyên ngành",
      "description": "Khóa học tiếng Anh dành cho sinh viên kỹ thuật",
      "credits": 3,
      "faculty": 3,
      "isActive": false
    }
  ]
}
```

**Response lỗi (400):**

```json
{
  "error": "ID khóa học không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Khóa học không tồn tại"
}
```

---

### 1.5 Lấy bản dịch khóa học

**Mô tả:** Lấy toàn bộ bản dịch của một khóa học (tất cả ngôn ngữ được hỗ trợ)

**Endpoint:** `GET /course/{id}/translation`

**Path Parameters:**

- `id` (integer): ID của khóa học

**Ví dụ Request:**

```bash
GET /api/course/1/translation
```

**Response thành công (200):**

```json
{
  "vi": {
    "courseName": "Lập trình cơ bản",
    "description": "Khóa học giới thiệu về lập trình"
  },
  "en": {
    "courseName": "Basic Programming",
    "description": "Introduction to programming course"
  }
}
```

**Response lỗi (400):**

```json
{
  "error": "ID khóa học không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Khóa học không tồn tại"
}
```

---

### 1.6 Cập nhật bản dịch khóa học

**Mô tả:** Cập nhật bản dịch cho một khóa học trong các ngôn ngữ được hỗ trợ

**Endpoint:** `PUT /course/{id}/translation`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**

- `id` (integer): ID của khóa học

**Request Body:**

```json
{
  "vi": {
    "courseName": "Lập trình nâng cao",
    "description": "Khóa học lập trình nâng cao cho sinh viên"
  },
  "en": {
    "courseName": "Advanced Programming",
    "description": "Advanced programming course for students"
  }
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cập nhật bản dịch thành công"
}
```

**Response lỗi (400):**

```json
{
  "error": "ID khóa học không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Khóa học không tồn tại"
}
```

---

## 2. API Quản lý Lớp học phần (Class Section)

### 2.1 Lấy danh sách lớp học phần

**Mô tả:** Lấy toàn bộ danh sách lớp học phần trong hệ thống

**Endpoint:** `GET /class-section`

**Query Parameters:** Không có

**Ví dụ Request:**

```bash
GET /api/class-section
```

**Response thành công (200):**

```json
[
  {
    "id": 1,
    "code": "CS101-01",
    "courseId": 1,
    "semester": "2024-1",
    "year": 2024,
    "maxEnrollment": 30,
    "currentEnrollment": 25,
    "schedule": "T2,4,6 - 7:30-9:30",
    "room": "A101",
    "instructor": "Nguyễn Văn A",
    "status": "active",
    "createdAt": "2024-01-15T08:30:00Z",
    "updatedAt": "2024-01-15T08:30:00Z"
  },
  {
    "id": 2,
    "code": "MATH201-01",
    "courseId": 2,
    "semester": "2024-1",
    "year": 2024,
    "maxEnrollment": 40,
    "currentEnrollment": 38,
    "schedule": "T3,5,7 - 9:30-11:30",
    "room": "B205",
    "instructor": "Trần Thị B",
    "status": "active",
    "createdAt": "2024-01-16T09:00:00Z",
    "updatedAt": "2024-01-16T09:00:00Z"
  }
]
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi server"
}
```

---

### 2.2 Thêm lớp học phần mới

**Mô tả:** Tạo một lớp học phần mới cho khóa học

**Endpoint:** `POST /class-section`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "code": "ENG301-01",
  "courseId": 3,
  "semester": "2024-2",
  "year": 2024,
  "maxEnrollment": 25,
  "currentEnrollment": 0,
  "schedule": "T2,4 - 13:30-15:30",
  "room": "C301",
  "instructor": "Phạm Văn C",
  "status": "active"
}
```

**Response thành công (201):**

```json
{
  "message": "Thêm lớp học thành công",
  "classSection": [
    {
      "id": 3,
      "code": "ENG301-01",
      "courseId": 3,
      "semester": "2024-2",
      "year": 2024,
      "maxEnrollment": 25,
      "currentEnrollment": 0,
      "schedule": "T2,4 - 13:30-15:30",
      "room": "C301",
      "instructor": "Phạm Văn C",
      "status": "active",
      "createdAt": "2024-01-17T10:15:00Z",
      "updatedAt": "2024-01-17T10:15:00Z"
    }
  ]
}
```

**Response lỗi (400) - Validation:**

```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["code"],
      "message": "Required"
    }
  ]
}
```

**Response lỗi (400) - Mã lớp đã tồn tại:**

```json
{
  "error": "Mã lớp học đã tồn tại"
}
```

**Response lỗi (400) - Khóa học không tồn tại:**

```json
{
  "error": "Khóa học không tồn tại"
}
```

---

### 2.3 Cập nhật lớp học phần

**Mô tả:** Cập nhật thông tin của một lớp học phần hiện có

**Endpoint:** `PUT /class-section`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "id": 3,
  "code": "ENG301-01",
  "courseId": 3,
  "semester": "2024-2",
  "year": 2024,
  "maxEnrollment": 30,
  "currentEnrollment": 15,
  "schedule": "T2,4,6 - 13:30-15:30",
  "room": "C302",
  "instructor": "Phạm Văn C",
  "status": "active"
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cập nhật lớp học thành công",
  "classSections": [
    {
      "id": 3,
      "code": "ENG301-01",
      "courseId": 3,
      "semester": "2024-2",
      "year": 2024,
      "maxEnrollment": 30,
      "currentEnrollment": 15,
      "schedule": "T2,4,6 - 13:30-15:30",
      "room": "C302",
      "instructor": "Phạm Văn C",
      "status": "active",
      "createdAt": "2024-01-17T10:15:00Z",
      "updatedAt": "2024-01-17T11:45:00Z"
    }
  ]
}
```

**Response lỗi (400):**

```json
{
  "error": "Cập nhật lớp học không hợp lệ"
}
```

**Response lỗi (404):**

```json
{
  "error": "Lớp học không tồn tại"
}
```

---

### 2.4 Xóa lớp học phần

**Mô tả:** Xóa một lớp học phần khỏi hệ thống. Chỉ có thể xóa khi lớp chưa có sinh viên đăng ký

**Endpoint:** `DELETE /class-section/{id}`

**Path Parameters:**

- `id` (integer): ID của lớp học phần cần xóa

**Ví dụ Request:**

```bash
DELETE /api/class-section/3
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Xóa lớp học thành công",
  "classSections": [
    {
      "id": 1,
      "code": "CS101-01",
      "courseId": 1,
      "semester": "2024-1",
      "year": 2024,
      "maxEnrollment": 30,
      "currentEnrollment": 25,
      "schedule": "T2,4,6 - 7:30-9:30",
      "room": "A101",
      "instructor": "Nguyễn Văn A",
      "status": "active"
    }
  ]
}
```

**Response lỗi (400) - ID trống:**

```json
{
  "error": "ID lớp học không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Lớp học không tồn tại"
}
```

**Response lỗi (400) - Lớp đang được sử dụng:**

```json
{
  "error": "Không thể xóa lớp học đang được sử dụng"
}
```

---

### 2.5 Lấy lớp học phần theo khóa học

**Mô tả:** Lấy danh sách tất cả lớp học phần của một khóa học cụ thể

**Endpoint:** `GET /class-section/course/{courseId}`

**Path Parameters:**

- `courseId` (integer): ID của khóa học

**Ví dụ Request:**

```bash
GET /api/class-section/course/1
```

**Response thành công (200):**

```json
[
  {
    "id": 1,
    "code": "CS101-01",
    "courseId": 1,
    "semester": "2024-1",
    "year": 2024,
    "maxEnrollment": 30,
    "currentEnrollment": 25,
    "schedule": "T2,4,6 - 7:30-9:30",
    "room": "A101",
    "instructor": "Nguyễn Văn A",
    "status": "active",
    "createdAt": "2024-01-15T08:30:00Z",
    "updatedAt": "2024-01-15T08:30:00Z"
  },
  {
    "id": 4,
    "code": "CS101-02",
    "courseId": 1,
    "semester": "2024-1",
    "year": 2024,
    "maxEnrollment": 30,
    "currentEnrollment": 20,
    "schedule": "T3,5,7 - 7:30-9:30",
    "room": "A102",
    "instructor": "Lê Thị D",
    "status": "active",
    "createdAt": "2024-01-15T08:45:00Z",
    "updatedAt": "2024-01-15T08:45:00Z"
  }
]
```

**Response lỗi (404):**

```json
{
  "error": "Không tìm thấy lớp học nào cho khóa học này"
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy danh sách lớp học theo khóa"
}
```

---

## 3. API Quản lý Khoa (Faculty)

### 3.1. Lấy danh sách khoa

**Mô tả**: API này dùng để lấy danh sách tất cả các khoa trong hệ thống.

- **URL**: `GET /faculty`
- **Method**: GET
- **Query Parameters**:
    - `lang` (string, optional): Ngôn ngữ hiển thị ('vi' hoặc 'en'). Mặc định: 'vi'

**Ví dụ Request**:

```
GET /faculty?lang=vi
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "name": "Khoa Công nghệ Thông tin",
    "code": "CNTT"
  },
  {
    "id": 2,
    "name": "Khoa Kinh tế",
    "code": "KT"
  }
]
```

**Error Response**:

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi lấy danh sách khoa"
}
```

---

### 3.2. Lấy thông tin khoa theo ID

**Mô tả**: API này dùng để lấy thông tin chi tiết của một khoa cụ thể.

- **URL**: `GET /faculty/:id`
- **Method**: GET
- **URL Parameters**:
    - `id` (integer): ID của khoa cần lấy thông tin

**Ví dụ Request**:

```
GET /faculty/1
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "id": 1,
  "name": "Khoa Công nghệ Thông tin",
  "code": "CNTT"
}
```

**Error Response**:

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Faculty not found"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID khoa không được để trống"
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi server"
}
```

---

### 3.3. Tạo khoa mới

**Mô tả**: API này dùng để tạo một khoa mới trong hệ thống.

- **URL**: `POST /faculty`
- **Method**: POST
- **Headers**:
    - `Content-Type: application/json`
- **Body Parameters**:
    - `name` (string, required): Tên khoa
    - `code` (string, optional): Mã khoa

**Ví dụ Request**:

```json
{
  "name": "Khoa Ngoại ngữ",
  "code": "NN"
}
```

**Success Response**:

- **Code**: 201 Created
- **Content**:

```json
{
  "success": true,
  "message": "Thêm khoa thành công",
  "faculties": [
    {
      "id": 1,
      "name": "Khoa Công nghệ Thông tin",
      "code": "CNTT"
    },
    {
      "id": 2,
      "name": "Khoa Ngoại ngữ",
      "code": "NN"
    }
  ]
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": [
    {
      "field": "name",
      "message": "Tên khoa là bắt buộc"
    }
  ]
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi thêm khoa"
}
```

---

### 3.4. Cập nhật thông tin khoa

**Mô tả**: API này dùng để cập nhật thông tin của một khoa đã tồn tại.

- **URL**: `PUT /faculty`
- **Method**: PUT
- **Headers**:
    - `Content-Type: application/json`
- **Body Parameters**:
    - `id` (integer, required): ID của khoa cần cập nhật
    - `name` (string, required): Tên khoa mới
    - `code` (string, optional): Mã khoa mới

**Ví dụ Request**:

```json
{
  "id": 1,
  "name": "Khoa Công nghệ Thông tin và Truyền thông",
  "code": "CNTT-TT"
}
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Cập nhật khoa thành công",
  "faculties": [
    {
      "id": 1,
      "name": "Khoa Công nghệ Thông tin và Truyền thông",
      "code": "CNTT-TT"
    },
    {
      "id": 2,
      "name": "Khoa Ngoại ngữ",
      "code": "NN"
    }
  ]
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Dữ liệu không hợp lệ"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}

```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi cập nhật khoa"
}
```

---

### 3.5. Xóa khoa

**Mô tả**: API này dùng để xóa một khoa khỏi hệ thống.

- **URL**: `DELETE /faculty/:id`
- **Method**: DELETE
- **URL Parameters**:
    - `id` (integer): ID của khoa cần xóa

**Ví dụ Request**:

```
DELETE /faculty/1
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Xóa khoa thành công",
  "faculties": [
    {
      "id": 2,
      "name": "Khoa Ngoại ngữ",
      "code": "NN"
    }
  ]
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID khoa không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi xóa khoa"
}
```

---

### 3.6. Lấy bản dịch của khoa

**Mô tả**: API này dùng để lấy tất cả bản dịch của một khoa theo các ngôn ngữ được hỗ trợ.

- **URL**: `GET /faculty/:id/translation`
- **Method**: GET
- **URL Parameters**:
    - `id` (integer): ID của khoa cần lấy bản dịch

**Ví dụ Request**:

```
GET /faculty/1/translation
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "en": {
    "facultyName": "Faculty of Information Technology",
    "description": "Faculty specializing in IT education"
  },
  "vi": {
    "facultyName": "Khoa Công nghệ Thông tin",
    "description": "Khoa chuyên về giáo dục công nghệ thông tin"
  }
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID khoa không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi lấy danh sách khoa"
}
```

---

### 3.7. Cập nhật bản dịch của khoa

**Mô tả**: API này dùng để cập nhật bản dịch của khoa theo các ngôn ngữ được hỗ trợ.

- **URL**: `PUT /faculty/:id/translation`
- **Method**: PUT
- **Headers**:
    - `Content-Type: application/json`
- **URL Parameters**:
    - `id` (integer): ID của khoa cần cập nhật bản dịch
- **Body Parameters**: Object chứa bản dịch theo từng ngôn ngữ

**Ví dụ Request**:

```json
{
  "en": {
    "facultyName": "Faculty of Information Technology and Communications",
    "description": "Faculty specializing in IT and Communications education"
  },
  "vi": {
    "facultyName": "Khoa Công nghệ Thông tin và Truyền thông",
    "description": "Khoa chuyên về giáo dục công nghệ thông tin và truyền thông"
  }
}
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Cập nhật bản dịch thành công"
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID khoa không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi cập nhật khoa"
}
```

---

## 4. API Quản lý Log

### 4.1. Lấy danh sách log

**Mô tả**: API này dùng để lấy danh sách tất cả các log trong hệ thống.

- **URL**: `GET /log`
- **Method**: GET

**Ví dụ Request**:

```
GET /log
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": 1,
    "message": "Thêm khoa thành công",
    "level": "info",
    "action": "create",
    "entity": "faculty",
    "user": "admin",
    "details": "Add new faculty: Khoa Công nghệ Thông tin",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "message": "Xóa khoa thành công",
    "level": "info",
    "action": "delete",
    "entity": "faculty",
    "user": "admin",
    "details": "Deleted faculty: 1",
    "timestamp": "2024-01-15T11:00:00.000Z"
  }
]
```

**Error Response**:

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi server khi lấy danh sách log"
}
```

---

### 4.2. Thêm log mới

**Mô tả**: API này dùng để thêm một bản ghi log mới vào hệ thống.

- **URL**: `POST /log`
- **Method**: POST
- **Headers**:
    - `Content-Type: application/json`
- **Body Parameters**:
    - `message` (string, required): Nội dung thông báo log
    - `level` (string, required): Mức độ log ('info', 'warn', 'error')
    - `action` (string, optional): Hành động được thực hiện ('create', 'update', 'delete')
    - `entity` (string, optional): Đối tượng bị tác động
    - `user` (string, optional): Người thực hiện hành động
    - `details` (string, optional): Chi tiết bổ sung

**Ví dụ Request**:

```json
{
  "message": "Cập nhật khoa thành công",
  "level": "info",
  "action": "update",
  "entity": "faculty",
  "user": "admin",
  "details": "Updated faculty: Khoa Ngoại ngữ"
}
```

**Success Response**:

- **Code**: 201 Created
- **Content**:

```json
{
  "message": "Thêm log thành công",
  "log": {
    "id": 3,
    "message": "Cập nhật khoa thành công",
    "level": "info",
    "action": "update",
    "entity": "faculty",
    "user": "admin",
    "details": "Updated faculty: Khoa Ngoại ngữ",
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": [
    {
      "field": "message",
      "message": "Nội dung log là bắt buộc"
    },
    {
      "field": "level",
      "message": "Mức độ log là bắt buộc"
    }
  ]
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi khi thêm log"
}
```

---

## 5. API Quản lý chương trình học (Program)

### 5.1 Lấy danh sách chương trình học

- **Endpoint**: `GET /api/program`
- **Mô tả**: Lấy danh sách tất cả các chương trình học có trong hệ thống
- **Headers**:
    - `Accept-Language: vi` (tùy chọn, mặc định là 'vi')
- **Query Parameters**: Không có
- **Request Body**: Không có

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "1",
    "name": "Công nghệ thông tin",
    "faculty": "CNTT"
  },
  {
    "id": "2",
    "name": "Kỹ thuật phần mềm",
    "faculty": "CNTT"
  }
]
```

**Error Response:**

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi hệ thống"
}
```

### 5.2 Tạo chương trình học mới

- **Endpoint**: `POST /api/program`
- **Mô tả**: Tạo một chương trình học mới trong hệ thống
- **Headers**:
    - `Content-Type: application/json`
    - `Accept-Language: vi` (tùy chọn)
- **Request Body**:

```json
{
  "name": "Khoa học máy tính",
  "faculty": "CNTT"
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "message": "Thêm chương trình học thành công",
  "programs": [
    {
      "id": "1",
      "name": "Công nghệ thông tin",
      "faculty": "CNTT"
    },
    {
      "id": "3",
      "name": "Khoa học máy tính",
      "faculty": "CNTT"
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": [
    {
      "field": "name",
      "message": "Tên chương trình không được để trống"
    }
  ]
}
```

### 5.3 Cập nhật chương trình học

- **Endpoint**: `PUT /api/program`
- **Mô tả**: Cập nhật thông tin của một chương trình học đã tồn tại
- **Headers**:
    - `Content-Type: application/json`
    - `Accept-Language: vi` (tùy chọn)
- **Request Body**:

```json
{
  "id": "1",
  "name": "Công nghệ thông tin cập nhật",
  "faculty": "CNTT"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Cập nhật chương trình học thành công",
  "programs": [
    {
      "id": "1",
      "name": "Công nghệ thông tin cập nhật",
      "faculty": "CNTT"
    }
  ]
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Chương trình học không tồn tại"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": [
    {
      "field": "name",
      "message": "Tên chương trình không hợp lệ"
    }
  ]
}
```

### 5.4 Xóa chương trình học

- **Endpoint**: `DELETE /api/program/:id`
- **Mô tả**: Xóa một chương trình học khỏi hệ thống (chỉ khi không có sinh viên nào đang theo học)
- **URL Parameters**:
    - `id` (string): ID của chương trình học cần xóa
- **Headers**:
    - `Accept-Language: vi` (tùy chọn)

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Xóa chương trình học thành công",
  "programs": [
    {
      "id": "2",
      "name": "Kỹ thuật phần mềm",
      "faculty": "CNTT"
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Không thể xóa chương trình học"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID không được để trống"
}
```

### 5.5 Lấy bản dịch chương trình học

- **Endpoint**: `GET /api/program/:id/translation`
- **Mô tả**: Lấy tất cả bản dịch của một chương trình học theo các ngôn ngữ được hỗ trợ
- **URL Parameters**:
    - `id` (string): ID của chương trình học

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "vi": {
    "programName": "Công nghệ thông tin"
  },
  "en": {
    "programName": "Information Technology"
  }
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID chương trình không được để trống"
}
```

### 5.6 Cập nhật bản dịch chương trình học

- **Endpoint**: `PUT /api/program/:id/translation`
- **Mô tả**: Cập nhật bản dịch của chương trình học cho các ngôn ngữ khác nhau
- **URL Parameters**:
    - `id` (string): ID của chương trình học
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "vi": {
    "programName": "Công nghệ thông tin"
  },
  "en": {
    "programName": "Information Technology"
  }
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Cập nhật bản dịch thành công"
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Khoa không tồn tại"
}
```

## 6. API Quản lý Đăng ký học (Registration)

### 6.1 Lấy danh sách đăng ký học

- **Endpoint**: `GET /api/registration`
- **Mô tả**: Lấy danh sách tất cả các đăng ký học trong hệ thống
- **Query Parameters**: Không có
- **Request Body**: Không có

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "1",
    "studentId": "2021001",
    "classSectionId": "CS101_01",
    "status": "active",
    "registrationDate": "2024-01-15",
    "grade": 8.5
  },
  {
    "id": "2",
    "studentId": "2021002",
    "classSectionId": "CS102_01",
    "status": "active",
    "registrationDate": "2024-01-16",
    "grade": null
  }
]
```

**Error Response:**

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi hệ thống"
}
```

### 6.2 Lấy thông tin đăng ký học theo ID

- **Endpoint**: `GET /api/registration/:id`
- **Mô tả**: Lấy thông tin chi tiết của một đăng ký học cụ thể
- **URL Parameters**:
    - `id` (string): ID của đăng ký học

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "1",
  "studentId": "2021001",
  "classSectionId": "CS101_01",
  "status": "active",
  "registrationDate": "2024-01-15",
  "grade": 8.5
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Registration not found"
}
```

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi hệ thống"
}
```

### 6.3 Tạo đăng ký học mới

- **Endpoint**: `POST /api/registration`
- **Mô tả**: Tạo một đăng ký học mới cho sinh viên vào lớp học phần
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "studentId": "2021003",
  "classSectionId": "CS101_02",
  "status": "active"
}
```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "message": "Thêm đăng ký học thành công",
  "registrations": [
    {
      "id": "3",
      "studentId": "2021003",
      "classSectionId": "CS101_02",
      "status": "active",
      "registrationDate": "2024-01-17"
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Sinh viên không tồn tại"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Lớp học đã đủ sĩ số"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Sinh viên đã đăng ký lớp học này"
}
```

### 6.4 Cập nhật đăng ký học

- **Endpoint**: `PUT /api/registration/:id`
- **Mô tả**: Cập nhật thông tin của một đăng ký học đã tồn tại
- **URL Parameters**:
    - `id` (string): ID của đăng ký học
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "studentId": "2021003",
  "classSectionId": "CS101_03",
  "status": "active"
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Cập nhật đăng ký học thành công",
  "registrations": [
    {
      "id": "3",
      "studentId": "2021003",
      "classSectionId": "CS101_03",
      "status": "active"
    }
  ]
}
```

**Error Response:**

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Đăng ký học không tồn tại"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Sinh viên không tồn tại"
}
```

### 6.5 Xóa đăng ký học

- **Endpoint**: `DELETE /api/registration/:id`
- **Mô tả**: Xóa một đăng ký học khỏi hệ thống
- **URL Parameters**:
    - `id` (string): ID của đăng ký học cần xóa

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Xóa đăng ký học thành công",
  "registrations": [
    {
      "id": "1",
      "studentId": "2021001",
      "classSectionId": "CS101_01",
      "status": "active"
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID đăng ký học không được để trống"
}
```

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Không thể xóa đăng ký học đang được sử dụng"
}
```

### 6.6 Hủy đăng ký học

- **Endpoint**: `PATCH /api/registration/:id/cancel`
- **Mô tả**: Hủy một đăng ký học (thay đổi trạng thái thành "cancelled" và giảm sĩ số lớp)
- **URL Parameters**:
    - `id` (string): ID của đăng ký học cần hủy

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Hủy đăng ký học thành công",
  "registrations": [
    {
      "id": "1",
      "studentId": "2021001",
      "classSectionId": "CS101_01",
      "status": "cancelled"
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID đăng ký học không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Đăng ký học không tồn tại"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Lớp học không tồn tại"
}
```

### 6.7 Lấy điểm theo lớp học

- **Endpoint**: `GET /api/registration/grade/:classId`
- **Mô tả**: Lấy danh sách điểm của tất cả sinh viên trong một lớp học phần
- **URL Parameters**:
    - `classId` (string): ID của lớp học phần

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "1",
    "studentId": "2021001",
    "classSectionId": "CS101_01",
    "status": "active",
    "grade": 8.5,
    "registrationDate": "2024-01-15"
  },
  {
    "id": "2",
    "studentId": "2021002",
    "classSectionId": "CS101_01",
    "status": "active",
    "grade": 7.0,
    "registrationDate": "2024-01-16"
  }
]
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID lớp học không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Không tìm thấy đăng ký học nào cho lớp học này"
}
```

### 6.8 Lưu điểm theo lớp học

- **Endpoint**: `POST /api/registration/grade/:classId`
- **Mô tả**: Cập nhật điểm cho tất cả sinh viên trong một lớp học phần
- **URL Parameters**:
    - `classId` (string): ID của lớp học phần
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "grades": {
    "2021001": 8.5,
    "2021002": 7.0,
    "2021003": 9.0
  }
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Cập nhật điểm thành công",
  "grades": [
    {
      "id": "1",
      "studentId": "2021001",
      "classSectionId": "CS101_01",
      "grade": 8.5
    },
    {
      "id": "2",
      "studentId": "2021002",
      "classSectionId": "CS101_01",
      "grade": 7.0
    }
  ]
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "ID lớp học không được để trống"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Không tìm thấy đăng ký học nào cho lớp học này"
}
```

## 7. API Quản lý học kỳ (Semester)

### 7.1 Lấy danh sách học kỳ

- **Endpoint**: `GET /api/semester`
- **Mô tả**: Lấy danh sách tất cả các học kỳ trong hệ thống
- **Query Parameters**: Không có
- **Request Body**: Không có

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "1",
    "name": "Học kỳ 1 năm 2024-2025",
    "startDate": "2024-09-01",
    "endDate": "2024-12-31",
    "isActive": true
  },
  {
    "id": "2",
    "name": "Học kỳ 2 năm 2024-2025",
    "startDate": "2025-01-01",
    "endDate": "2025-05-31",
    "isActive": false
  }
]
```

**Error Response:**

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "error": "Lỗi hệ thống"
}
```

### 7.2 Tạo học kỳ mới

- **Endpoint**: `POST /api/semester`
- **Mô tả**: Tạo một học kỳ mới trong hệ thống
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "Học kỳ hè năm 2024",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "isActive": false

```

**Success Response:**

- **Code**: 201 Created
- **Content**:

```json
{
  "id": "3",
  "name": "Học kỳ hè năm 2024",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "isActive": false
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Dữ liệu học kỳ không hợp lệ"
}
```

### 7.3 Cập nhật học kỳ

- **Endpoint**: `PUT /api/semester/:id`
- **Mô tả**: Cập nhật thông tin của một học kỳ đã tồn tại
- **URL Parameters**:
    - `id` (string): ID của học kỳ cần cập nhật
- **Headers**:
    - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "Học kỳ 1 năm 2024-2025 (cập nhật)",
  "startDate": "2024-09-15",
  "endDate": "2024-12-31",
  "isActive": true
}
```

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "1",
  "name": "Học kỳ 1 năm 2024-2025 (cập nhật)",
  "startDate": "2024-09-15",
  "endDate": "2024-12-31",
  "isActive": true
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Dữ liệu cập nhật không hợp lệ"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Học kỳ không tồn tại"
}
```

### 7.4 Xóa học kỳ

- **Endpoint**: `DELETE /api/semester/:id`
- **Mô tả**: Xóa một học kỳ khỏi hệ thống
- **URL Parameters**:
    - `id` (string): ID của học kỳ cần xóa

**Success Response:**

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Xóa học kỳ thành công"
}
```

**Error Response:**

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "error": "Không thể xóa học kỳ đang được sử dụng"
}
```

- **Code**: 404 Not Found
- **Content**:

```json
{
  "error": "Học kỳ không tồn tại"
}
```

## 8. API Quản lý Cài đặt (Settings)

### 8.1 Lấy tất cả cài đặt

**Mô tả:** Lấy tất cả cài đặt hệ thống bao gồm quy tắc chuyển đổi trạng thái, danh sách domain được phép và định dạng số điện thoại.

**Endpoint:** `GET /api/settings`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
{
  "statusTransitionRules": [
    {
      "fromStatus": 1,
      "toStatus": [2, 3, 4]
    },
    {
      "fromStatus": 2,
      "toStatus": [3, 5]
    }
  ],
  "allowedEmailDomains": [
    "@gmail.com",
    "@company.com",
    "@edu.vn"
  ],
  "phoneFormats": [
    "84xxxxxxxxx",
    "0xxxxxxxxx",
    "+84xxxxxxxxx"
  ]
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy tất cả cài đặt"
}
```

### 8.2 Lấy danh sách domain được phép

**Mô tả:** Lấy danh sách các domain email được phép sử dụng trong hệ thống.

**Endpoint:** `GET /api/settings/domains`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
{
  "domains": [
    "@gmail.com",
    "@company.com",
    "@edu.vn"
  ]
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy danh sách domain"
}
```

### 8.3 Cập nhật danh sách domain được phép

**Mô tả:** Cập nhật danh sách các domain email được phép sử dụng trong hệ thống.

**Endpoint:** `PATCH /api/settings/domains`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:**

```json
{
  "domains": [
    "@gmail.com",
    "@company.com",
    "@edu.vn",
    "@newdomain.com"
  ]
}
```

**Response thành công (200):**

```json
{
  "message": "Cập nhật domain thành công"
}
```

**Response lỗi (400):**

```json
{
  "error": "Danh sách domain không được để trống"
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi cập nhật domains"
}
```

### 8.4 Cập nhật định dạng số điện thoại

**Mô tả:** Cập nhật các định dạng số điện thoại được phép trong hệ thống.

**Endpoint:** `PATCH /api/settings/phone`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:**

```json
{
  "phoneFormats": "[\"84xxxxxxxxx\", \"0xxxxxxxxx\", \"+84xxxxxxxxx\"]"
}
```

**Response thành công (200):**

```json
{
  "message": "Cập nhật phone formats thành công"
}
```

**Response lỗi (400):**

```json
{
  "error": "Danh sách phone formats không được để trống"
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi cập nhật phone formats"
}
```

### 8.5 Lấy quy tắc chuyển đổi trạng thái (từ Settings)

**Mô tả:** Lấy quy tắc chuyển đổi trạng thái được định nghĩa trong cài đặt, trả về dạng key-value với tên trạng thái.

**Endpoint:** `GET /api/settings/status/rules`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
{
  "Đang học": ["Tạm nghỉ", "Thôi học", "Tốt nghiệp"],
  "Tạm nghỉ": ["Đang học", "Thôi học"],
  "Thôi học": [],
  "Tốt nghiệp": []
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy danh sách setting"
}
```

## 9. API Quản lý Trạng thái (Status)

### 9.1 Lấy danh sách trạng thái

**Mô tả:** Lấy danh sách tất cả các trạng thái sinh viên trong hệ thống.

**Endpoint:** `GET /api/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
[
  {
    "id": 1,
    "name": "Đang học",
    "color": "#28a745",
    "allowedStatus": [2, 3, 4]
  },
  {
    "id": 2,
    "name": "Tạm nghỉ",
    "color": "#ffc107",
    "allowedStatus": [1, 3]
  },
  {
    "id": 3,
    "name": "Thôi học",
    "color": "#dc3545",
    "allowedStatus": []
  },
  {
    "id": 4,
    "name": "Tốt nghiệp",
    "color": "#17a2b8",
    "allowedStatus": []
  }
]
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy danh sách trạng thái"
}
```

### 9.2 Tạo trạng thái mới

**Mô tả:** Tạo một trạng thái sinh viên mới trong hệ thống.

**Endpoint:** `POST /api/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Query Parameters:** Không có

**Request Body:**

```json
{
  "name": "Học thử",
  "color": "#6f42c1",
  "allowedStatus": [1, 3]
}
```

**Response thành công (201):**

```json
{
  "message": "Thêm tình trạng sinh viên thành công",
  "statuses": [
    {
      "id": 1,
      "name": "Đang học",
      "color": "#28a745",
      "allowedStatus": [2, 3, 4]
    },
    {
      "id": 5,
      "name": "Học thử",
      "color": "#6f42c1",
      "allowedStatus": [1, 3]
    }
  ]
}
```

**Response lỗi (400):**

```json
{
  "error": [
    {
      "field": "name",
      "message": "Tên trạng thái là bắt buộc"
    },
    {
      "field": "color",
      "message": "Màu sắc không hợp lệ"
    }
  ]
}
```

### 9.3 Cập nhật trạng thái

**Mô tả:** Cập nhật thông tin của một trạng thái sinh viên hiện có.

**Endpoint:** `PUT /api/status`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Query Parameters:** Không có

**Request Body:**

```json
{
  "id": 5,
  "name": "Học thử (đã cập nhật)",
  "color": "#e83e8c",
  "allowedStatus": [1, 2, 3]
}
```

**Response thành công (200):**

```json
{
  "message": "Cập nhật tình trạng sinh viên thành công",
  "statuses": [
    {
      "id": 1,
      "name": "Đang học",
      "color": "#28a745",
      "allowedStatus": [2, 3, 4]
    },
    {
      "id": 5,
      "name": "Học thử (đã cập nhật)",
      "color": "#e83e8c",
      "allowedStatus": [1, 2, 3]
    }
  ]
}
```

**Response lỗi (400):**

```json
{
  "error": [
    {
      "field": "name",
      "message": "Tên trạng thái là bắt buộc"
    }
  ]
}
```

**Response lỗi (404):**

```json
{
  "error": "Tình trạng sinh viên không tồn tại"
}
```

### 9.4 Xóa trạng thái

**Mô tả:** Xóa một trạng thái sinh viên khỏi hệ thống. Không thể xóa nếu có sinh viên đang sử dụng trạng thái này.

**Endpoint:** `DELETE /api/status/{id}`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Accept-Language": "vi"
}
```

**Path Parameters:**

- `id` (number): ID của trạng thái cần xóa

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
{
  "message": "Xóa tình trạng sinh viên thành công",
  "statuses": [
    {
      "id": 1,
      "name": "Đang học",
      "color": "#28a745",
      "allowedStatus": [2, 3, 4]
    },
    {
      "id": 2,
      "name": "Tạm nghỉ",
      "color": "#ffc107",
      "allowedStatus": [1, 3]
    }
  ]
}
```

**Response lỗi (400):**

```json
{
  "error": "ID không được để trống"
}
```

**Response lỗi (400):**

```json
{
  "error": "Không thể xóa tình trạng sinh viên đang được sử dụng"
}
```

### 9.5 Lấy quy tắc chuyển đổi trạng thái

**Mô tả:** Lấy danh sách quy tắc chuyển đổi trạng thái, trả về dạng mảng với ID trạng thái.

**Endpoint:** `GET /api/status/rules`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
[
  {
    "fromStatus": 1,
    "toStatus": [2, 3, 4]
  },
  {
    "fromStatus": 2,
    "toStatus": [1, 3]
  },
  {
    "fromStatus": 3,
    "toStatus": []
  },
  {
    "fromStatus": 4,
    "toStatus": []
  }
]
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi lấy quy tắc trạng thái"
}
```

### 9.6 Cập nhật quy tắc chuyển đổi trạng thái

**Mô tả:** Cập nhật quy tắc chuyển đổi trạng thái cho tất cả các trạng thái trong hệ thống.

**Endpoint:** `PATCH /api/status/rules`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters:** Không có

**Request Body:**

```json
{
  "statusTransitionsRules": "[{\"fromStatus\":1,\"toStatus\":[2,3]},{\"fromStatus\":2,\"toStatus\":[1,4]},{\"fromStatus\":3,\"toStatus\":[]},{\"fromStatus\":4,\"toStatus\":[]}]"
}
```

**Response thành công (200):**

```json
{
  "message": "Cập nhật quy tắc cho trạng thái thành công"
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi cập nhật quy tắc trạng thái"
}
```

### 9.7 Lấy bản dịch trạng thái theo ID

**Mô tả:** Lấy bản dịch của một trạng thái theo ID cho tất cả các ngôn ngữ được hỗ trợ.

**Endpoint:** `GET /api/status/{id}/translation`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**

- `id` (number): ID của trạng thái cần lấy bản dịch

**Query Parameters:** Không có

**Request Body:** Không có

**Response thành công (200):**

```json
{
  "vi": {
    "statusName": "Đang học"
  },
  "en": {
    "statusName": "Studying"
  }
}
```

**Response lỗi (400):**

```json
{
  "error": "ID tình trạng không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Tình trạng sinh viên không tồn tại"
}
```

### 9.8 Cập nhật bản dịch trạng thái theo ID

**Mô tả:** Cập nhật bản dịch của một trạng thái theo ID cho các ngôn ngữ được hỗ trợ.

**Endpoint:** `PUT /api/status/{id}/translation`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Path Parameters:**

- `id` (number): ID của trạng thái cần cập nhật bản dịch

**Query Parameters:** Không có

**Request Body:**

```json
{
  "vi": {
    "statusName": "Đang học (đã cập nhật)"
  },
  "en": {
    "statusName": "Studying (Updated)"
  }
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cập nhật bản dịch thành công"
}
```

**Response lỗi (400):**

```json
{
  "error": "ID tình trạng không được để trống"
}
```

**Response lỗi (404):**

```json
{
  "error": "Tình trạng sinh viên không tồn tại"
}
```

**Response lỗi (500):**

```json
{
  "error": "Lỗi khi cập nhật bản dịch tình trạng"
}
```

## 10. API Quản lý Sinh viên (Students)

### 10.1. Lấy danh sách sinh viên

**Mô tả**: API này được sử dụng để lấy danh sách tất cả sinh viên trong hệ thống.

**Endpoint**: `GET /api/students`

**Request Headers**:

```
Content-Type: application/json
```

**Query Parameters**: Không có

**Request Body**: Không có

**Success Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
[
  {
    "mssv": "2021001",
    "fullName": "Nguyễn Văn An",
    "email": "an.nguyen@student.hcmut.edu.vn",
    "phone": "0901234567",
    "dateOfBirth": "2003-05-15",
    "address": "123 Nguyễn Trãi, Q1, TP.HCM",
    "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
    "program": "60f7b3c8d4e5f6a7b8c9d0e2",
    "status": "60f7b3c8d4e5f6a7b8c9d0e3",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "mssv": "2021002",
    "fullName": "Trần Thị Bình",
    "email": "binh.tran@student.hcmut.edu.vn",
    "phone": "0907654321",
    "dateOfBirth": "2003-08-20",
    "address": "456 Lê Văn Việt, Q9, TP.HCM",
    "faculty": "60f7b3c8d4e5f6a7b8c9d0e4",
    "program": "60f7b3c8d4e5f6a7b8c9d0e5",
    "status": "60f7b3c8d4e5f6a7b8c9d0e3",
    "createdAt": "2024-01-16T14:20:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
]
```

**Error Response**:

- **Status Code**: `500 Internal Server Error`
- **Response Body**:

```json
{
  "error": "Lỗi server nội bộ"
}
```

---

### 10.2. Tạo sinh viên mới

**Mô tả**: API này được sử dụng để tạo một sinh viên mới trong hệ thống với validation đầy đủ theo cài đặt hệ thống.

**Endpoint**: `POST /api/students`

**Request Headers**:

```
Content-Type: application/json
```

**Query Parameters**: Không có

**Request Body**:

```json
{
  "fullName": "Lê Văn Cường",
  "email": "cuong.le@student.hcmut.edu.vn",
  "phone": "0912345678",
  "dateOfBirth": "2003-12-10",
  "address": "789 Võ Văn Tần, Q3, TP.HCM",
  "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
  "program": "60f7b3c8d4e5f6a7b8c9d0e2",
  "status": "60f7b3c8d4e5f6a7b8c9d0e3"
}
```

**Success Response**:

- **Status Code**: `201 Created`
- **Response Body**:

```json
{
  "mssv": "2021003",
  "fullName": "Lê Văn Cường",
  "email": "cuong.le@student.hcmut.edu.vn",
  "phone": "0912345678",
  "dateOfBirth": "2003-12-10",
  "address": "789 Võ Văn Tần, Q3, TP.HCM",
  "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
  "program": "60f7b3c8d4e5f6a7b8c9d0e2",
  "status": "60f7b3c8d4e5f6a7b8c9d0e3",
  "createdAt": "2024-01-17T09:15:00.000Z",
  "updatedAt": "2024-01-17T09:15:00.000Z"
}
```

**Error Response**:

- **Status Code**: `400 Bad Request`
- **Response Body** (Validation error):

```json
{
  "error": "[{\"code\":\"invalid_string\",\"message\":\"Required\",\"path\":[\"fullName\"]}]"
}
```

- **Status Code**: `400 Bad Request`
- **Response Body** (Email domain error):

```json
{
  "error": "Email phải thuộc một trong các tên miền: student.hcmut.edu.vn, hcmut.edu.vn"
}
```

- **Status Code**: `400 Bad Request`
- **Response Body** (Phone format error):

```json
{
  "error": "Số điện thoại không hợp lệ"
}
```

- **Status Code**: `400 Bad Request`
- **Response Body** (Entity not found):

```json
{
  "error": "Khoa không tồn tại"
}
```

---

### 10.3. Cập nhật thông tin sinh viên

**Mô tả**: API này được sử dụng để cập nhật thông tin của một sinh viên đã tồn tại trong hệ thống.

**Endpoint**: `PUT /api/students`

**Request Headers**:

```
Content-Type: application/json
```

**Query Parameters**: Không có

**Request Body**:

```json
{
  "mssv": "2021001",
  "fullName": "Nguyễn Văn An",
  "email": "an.nguyen.updated@student.hcmut.edu.vn",
  "phone": "0901234567",
  "dateOfBirth": "2003-05-15",
  "address": "123 Nguyễn Trãi, Q1, TP.HCM - Cập nhật",
  "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
  "program": "60f7b3c8d4e5f6a7b8c9d0e2",
  "status": "60f7b3c8d4e5f6a7b8c9d0e6"
}
```

**Success Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "success": true
}
```

**Error Response**:

- **Status Code**: `400 Bad Request`
- **Response Body** (Validation error):

```json
{
  "error": "Email phải thuộc một trong các tên miền: student.hcmut.edu.vn, hcmut.edu.vn"
}
```

- **Status Code**: `404 Not Found`
- **Response Body**:

```json
{
  "error": "Sinh viên không tồn tại"
}
```

- **Status Code**: `400 Bad Request`
- **Response Body** (Entity not found):

```json
{
  "error": "Khoa không tồn tại"
}
```

---

### 10.4. Xóa sinh viên

**Mô tả**: API này được sử dụng để xóa một sinh viên khỏi hệ thống dựa trên MSSV.

**Endpoint**: `DELETE /api/students/{mssv}`

**Request Headers**:

```
Content-Type: application/json
```

**Path Parameters**:

- `mssv` (string): Mã số sinh viên cần xóa

**Query Parameters**: Không có

**Request Body**: Không có

**Success Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "success": true
}
```

**Error Response**:

- **Status Code**: `400 Bad Request`
- **Response Body**:

```json
{
  "error": "MSSV không được để trống"
}
```

- **Status Code**: `404 Not Found`
- **Response Body**:

```json
{
  "error": "Sinh viên không tồn tại"
}
```

---

### 10.5. Thêm sinh viên từ file

**Mô tả**: API này được sử dụng để thêm một sinh viên mới từ dữ liệu file import, hỗ trợ đa ngôn ngữ cho việc mapping tên khoa, chương trình và trạng thái.

**Endpoint**: `POST /api/students/import`

**Request Headers**:

```
Content-Type: application/json
```

**Query Parameters**:

- `language` (string, optional): Ngôn ngữ để mapping dữ liệu. Mặc định là "vi". Các giá trị hỗ trợ: "vi", "en"

**Request Body**:

```json
{
  "fullName": "Phạm Thị Dung",
  "email": "dung.pham@student.hcmut.edu.vn",
  "phone": "0923456789",
  "dateOfBirth": "2003-03-25",
  "address": "321 Lý Thường Kiệt, Q10, TP.HCM",
  "faculty": "Khoa Công nghệ Thông tin",
  "program": "Kỹ thuật Phần mềm",
  "status": "Đang học"
}

```

**Success Response**:

- **Status Code**: `201 Created`
- **Response Body**:

```json
{
  "message": "Thêm sinh viên thành công",
  "student": {
    "mssv": "2021004",
    "fullName": "Phạm Thị Dung",
    "email": "dung.pham@student.hcmut.edu.vn",
    "phone": "0923456789",
    "dateOfBirth": "2003-03-25",
    "address": "321 Lý Thường Kiệt, Q10, TP.HCM",
    "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
    "program": "60f7b3c8d4e5f6a7b8c9d0e2",
    "status": "60f7b3c8d4e5f6a7b8c9d0e3",
    "createdAt": "2024-01-18T11:45:00.000Z",
    "updatedAt": "2024-01-18T11:45:00.000Z"
  }
}
```

**Error Response**:

- **Status Code**: `400 Bad Request`
- **Response Body** (Validation error):

```json
[
  {
    "code": "invalid_string",
    "message": "Required",
    "path": ["fullName"]
  }
]
```

- **Status Code**: `400 Bad Request`
- **Response Body** (Data mapping error):

```json
{
  "error": "Dữ liệu không hợp lệ"
}
```

---

### 10.6. Lấy điểm sinh viên theo ID

**Mô tả**: API này được sử dụng để lấy thông tin điểm số, GPA và các thông tin học tập của sinh viên dựa trên MSSV.

**Endpoint**: `GET /api/students/grades/{studentId}`

**Request Headers**:

```
Content-Type: application/json

```

**Path Parameters**:

- `studentId` (string): Mã số sinh viên cần lấy điểm

**Query Parameters**:

- `language` (string, optional): Ngôn ngữ hiển thị thông tin khóa học. Mặc định là "vi". Các giá trị hỗ trợ: "vi", "en"

**Request Body**: Không có

**Success Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "grades": [
    {
      "studentId": "2021001",
      "classSectionId": "60f7b3c8d4e5f6a7b8c9d0e7",
      "grade": 8.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z",
      "classInfo": {
        "id": "60f7b3c8d4e5f6a7b8c9d0e7",
        "courseId": "60f7b3c8d4e5f6a7b8c9d0e8",
        "semester": "HK1_2023-2024",
        "maxStudents": 50,
        "currentStudents": 45,
        "courseInfo": {
          "id": "60f7b3c8d4e5f6a7b8c9d0e8",
          "name": {
            "vi": "Lập trình hướng đối tượng",
            "en": "Object-Oriented Programming"
          },
          "code": "CO2003",
          "credits": 4,
          "description": {
            "vi": "Môn học về lập trình hướng đối tượng",
            "en": "Course about object-oriented programming"
          }
        }
      }
    },
    {
      "studentId": "2021001",
      "classSectionId": "60f7b3c8d4e5f6a7b8c9d0e9",
      "grade": 7.8,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-22T14:20:00.000Z",
      "classInfo": {
        "id": "60f7b3c8d4e5f6a7b8c9d0e9",
        "courseId": "60f7b3c8d4e5f6a7b8c9d0ea",
        "semester": "HK1_2023-2024",
        "maxStudents": 60,
        "currentStudents": 55,
        "courseInfo": {
          "id": "60f7b3c8d4e5f6a7b8c9d0ea",
          "name": {
            "vi": "Cơ sở dữ liệu",
            "en": "Database Systems"
          },
          "code": "CO2012",
          "credits": 3,
          "description": {
            "vi": "Môn học về hệ quản trị cơ sở dữ liệu",
            "en": "Course about database management systems"
          }
        }
      }
    }
  ],
  "studentInfo": {
    "mssv": "2021001",
    "fullName": "Nguyễn Văn An",
    "email": "an.nguyen@student.hcmut.edu.vn",
    "phone": "0901234567",
    "dateOfBirth": "2003-05-15",
    "address": "123 Nguyễn Trãi, Q1, TP.HCM",
    "faculty": "60f7b3c8d4e5f6a7b8c9d0e1",
    "program": "60f7b3c8d4e5f6a7b8c9d0e2",
    "status": "60f7b3c8d4e5f6a7b8c9d0e3"
  },
  "gpa": 8.2,
  "totalCredits": 7,
  "totalCourses": 2
}
```

**Error Response**:

- **Status Code**: `400 Bad Request`
- **Response Body**:

```json
{
  "error": "ID sinh viên không được để trống"
}
```

- **Status Code**: `404 Not Found`
- **Response Body**:

```json
{
  "error": "Không tìm thấy đăng ký học nào cho sinh viên này"
}
```

- **Status Code**: `500 Internal Server Error`
- **Response Body**:

```json
{
  "error": "Lỗi khi lấy điểm của sinh viên"
}
```