# Database Schema

# Tài liệu Cơ sở Dữ liệu - Schema và Quan hệ

![Untitled (4).svg](Database%20Schema%2021729e62e5ad807b802dead16984f83f/Untitled_(4).svg)

## Tổng quan hệ thống

Hệ thống quản lý sinh viên và đăng ký học phần với các thực thể chính: Faculty, Program, Course, ClassSection, Student, Registration và các bảng hỗ trợ.

---

## 1. Bảng `faculties` - Khoa

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của khoa |
| `name_vi` | VARCHAR(255) | NOT NULL | Tên khoa bằng tiếng Việt |
| `name_en` | VARCHAR(255) | NULL | Tên khoa bằng tiếng Anh |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Ghi chú:** Bảng lưu trữ thông tin các khoa/viện trong trường đại học.

---

## 2. Bảng `programs` - Chương trình đào tạo

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của chương trình |
| `name_vi` | VARCHAR(255) | NOT NULL | Tên chương trình bằng tiếng Việt |
| `name_en` | VARCHAR(255) | NULL | Tên chương trình bằng tiếng Anh |
| `faculty_id` | VARCHAR(50) | FOREIGN KEY REFERENCES faculties(id) | Mã khoa quản lý chương trình |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `faculties` (một khoa có nhiều chương trình)

---

## 3. Bảng `courses` - Học phần

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của học phần |
| `code` | VARCHAR(20) | UNIQUE NOT NULL | Mã học phần (VD: CS101) |
| `name_vi` | VARCHAR(255) | NOT NULL | Tên học phần bằng tiếng Việt |
| `name_en` | VARCHAR(255) | NULL | Tên học phần bằng tiếng Anh |
| `credits` | INT | NOT NULL CHECK (credits >= 0) | Số tín chỉ của học phần |
| `faculty_id` | VARCHAR(50) | FOREIGN KEY REFERENCES faculties(id) | Mã khoa quản lý học phần |
| `description_vi` | TEXT | NULL | Mô tả học phần bằng tiếng Việt |
| `description_en` | TEXT | NULL | Mô tả học phần bằng tiếng Anh |
| `is_active` | BOOLEAN | DEFAULT TRUE | Trạng thái hoạt động của học phần |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `faculties` (một khoa có nhiều học phần)
- Một-nhiều với `class_sections` (một học phần có nhiều lớp học phần)

---

## 4. Bảng `course_prerequisites` - Học phần tiên quyết

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `course_id` | VARCHAR(50) | FOREIGN KEY REFERENCES courses(id) | Mã học phần |
| `prerequisite_course_code` | VARCHAR(20) | NOT NULL | Mã học phần tiên quyết |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Khóa chính:** Composite key (`course_id`, `prerequisite_course_code`)

**Quan hệ:**

- Nhiều-nhiều giữa `courses` với chính nó (một học phần có thể có nhiều tiên quyết, một học phần có thể là tiên quyết của nhiều học phần khác)

---

## 5. Bảng `semesters` - Học kỳ

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Mã định danh duy nhất của học kỳ |
| `name` | VARCHAR(50) | NOT NULL | Tên học kỳ (VD: "Học kỳ 1", "Học kỳ 2", "Học kỳ hè") |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Ghi chú:** Bảng định nghĩa các học kỳ trong năm học.

---

## 6. Bảng `class_sections` - Lớp học phần

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của lớp học phần |
| `code` | VARCHAR(50) | UNIQUE NOT NULL | Mã lớp học phần |
| `course_id` | VARCHAR(50) | FOREIGN KEY REFERENCES courses(id) | Mã học phần |
| `academic_year` | VARCHAR(20) | NOT NULL | Năm học (VD: "2023-2024") |
| `semester` | VARCHAR(50) | NOT NULL | Học kỳ |
| `instructor` | VARCHAR(255) | NOT NULL | Tên giảng viên |
| `max_capacity` | INT | NOT NULL | Sức chứa tối đa của lớp |
| `current_enrollment` | INT | NOT NULL DEFAULT 0 | Số sinh viên hiện tại đã đăng ký |
| `schedule` | VARCHAR(255) | NOT NULL | Lịch học (VD: "Thứ 2, 7:30-11:30") |
| `classroom` | VARCHAR(100) | NOT NULL | Phòng học |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `courses` (một học phần có nhiều lớp học phần)
- Một-nhiều với `registrations` (một lớp có nhiều đăng ký)

---

## 7. Bảng `statuses` - Trạng thái sinh viên

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của trạng thái |
| `name_vi` | VARCHAR(100) | NOT NULL | Tên trạng thái bằng tiếng Việt |
| `name_en` | VARCHAR(100) | NULL | Tên trạng thái bằng tiếng Anh |
| `color` | VARCHAR(7) | NULL | Mã màu hiển thị (hex color) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Ghi chú:** Bảng định nghĩa các trạng thái sinh viên (đang học, tạm ngừng, tốt nghiệp, v.v.)

---

## 8. Bảng `status_transitions` - Chuyển đổi trạng thái

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `from_status_id` | VARCHAR(50) | FOREIGN KEY REFERENCES statuses(id) | Trạng thái nguồn |
| `to_status_id` | VARCHAR(50) | FOREIGN KEY REFERENCES statuses(id) | Trạng thái đích |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Khóa chính:** Composite key (`from_status_id`, `to_status_id`)

**Quan hệ:**

- Nhiều-nhiều giữa `statuses` với chính nó (định nghĩa chuyển đổi trạng thái hợp lệ)

---

## 9. Bảng `students` - Sinh viên

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Mã định danh duy nhất |
| `mssv` | VARCHAR(20) | UNIQUE NOT NULL | Mã số sinh viên |
| `full_name` | VARCHAR(255) | NOT NULL | Họ và tên đầy đủ |
| `date_of_birth` | DATE | NULL | Ngày sinh |
| `gender` | ENUM('M', 'F', 'Other') | NULL | Giới tính |
| `faculty_id` | VARCHAR(50) | FOREIGN KEY REFERENCES faculties(id) | Mã khoa |
| `course` | VARCHAR(50) | NULL | Khóa học |
| `program_id` | VARCHAR(50) | FOREIGN KEY REFERENCES programs(id) | Mã chương trình đào tạo |
| `nationality` | VARCHAR(100) | NULL | Quốc tịch |
| `email` | VARCHAR(255) | NULL | Địa chỉ email |
| `phone` | VARCHAR(20) | NULL | Số điện thoại |
| `status_id` | VARCHAR(50) | FOREIGN KEY REFERENCES statuses(id) | Trạng thái sinh viên |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `faculties` (một khoa có nhiều sinh viên)
- Nhiều-một với `programs` (một chương trình có nhiều sinh viên)
- Nhiều-một với `statuses` (một trạng thái có nhiều sinh viên)
- Một-nhiều với `student_addresses` (một sinh viên có nhiều địa chỉ)
- Một-một với `student_identity_documents` (một sinh viên có một giấy tờ tùy thân)
- Một-nhiều với `registrations` (một sinh viên có nhiều đăng ký học phần)

---

## 10. Bảng `student_addresses` - Địa chỉ sinh viên

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Mã định danh duy nhất |
| `student_id` | INT | FOREIGN KEY REFERENCES students(id) | Mã sinh viên |
| `address_type` | ENUM('permanent', 'mailing') | NOT NULL | Loại địa chỉ |
| `street_address` | VARCHAR(255) | NULL | Địa chỉ đường phố |
| `ward` | VARCHAR(100) | NULL | Phường/Xã |
| `district` | VARCHAR(100) | NULL | Quận/Huyện |
| `province` | VARCHAR(100) | NULL | Tỉnh/Thành phố |
| `country` | VARCHAR(100) | NULL | Quốc gia |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `students` (một sinh viên có thể có nhiều địa chỉ)

---

## 11. Bảng `student_identity_documents` - Giấy tờ tùy thân sinh viên

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `student_id` | INT | PRIMARY KEY FOREIGN KEY REFERENCES students(id) | Mã sinh viên |
| `document_type` | VARCHAR(50) | NULL | Loại giấy tờ (CMND, CCCD, Passport) |
| `document_number` | VARCHAR(50) | NULL | Số giấy tờ tùy thân |
| `issue_date` | DATE | NULL | Ngày cấp |
| `issue_place` | VARCHAR(255) | NULL | Nơi cấp |
| `expiry_date` | DATE | NULL | Ngày hết hạn |
| `has_chip` | BOOLEAN | DEFAULT FALSE | Có chip hay không |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |
| `issuing_country` | VARCHAR(50) | NULL | Quốc gia cung cấp |
| `notes` | TEXT | NULL | Ghi chú |

**Quan hệ:**

- Một-một với `students` (một sinh viên có một bộ giấy tờ tùy thân)

---

## 12. Bảng `registrations` - Đăng ký học phần

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | VARCHAR(50) | PRIMARY KEY | Mã định danh duy nhất của đăng ký |
| `student_id` | INT | FOREIGN KEY REFERENCES students(id) | Mã sinh viên |
| `class_section_id` | VARCHAR(50) | FOREIGN KEY REFERENCES class_sections(id) | Mã lớp học phần |
| `status` | ENUM('active', 'cancelled') | DEFAULT 'active' | Trạng thái đăng ký |
| `grade` | DECIMAL(3,2) | NULL | Điểm số (0.00-10.00) |
| `registered_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian đăng ký |
| `cancelled_at` | TIMESTAMP | NULL | Thời gian hủy đăng ký |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Quan hệ:**

- Nhiều-một với `students` (một sinh viên có nhiều đăng ký)
- Nhiều-một với `class_sections` (một lớp có nhiều đăng ký)

---

## 13. Bảng `counters` - Bộ đếm

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `name` | VARCHAR(100) | PRIMARY KEY | Tên bộ đếm |
| `value` | INT | NOT NULL | Giá trị hiện tại của bộ đếm |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Ghi chú:** Bảng dùng để tạo ID tự động cho các thực thể không dùng AUTO_INCREMENT.

---

## 14. Bảng `settings` - Cài đặt hệ thống

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | INT | PRIMARY KEY AUTO_INCREMENT | Mã định danh duy nhất |
| `setting_key` | VARCHAR(100) | UNIQUE NOT NULL | Khóa cài đặt |
| `setting_value` | JSON | NULL | Giá trị cài đặt (JSON format) |
| `description` | TEXT | NULL | Mô tả cài đặt |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

**Ghi chú:** Lưu trữ các cài đặt hệ thống như domain được phép, định dạng số điện thoại, v.v.

---

## 15. Bảng `logs` - Nhật ký hệ thống

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| --- | --- | --- | --- |
| `id` | BIGINT | PRIMARY KEY AUTO_INCREMENT | Mã định danh duy nhất |
| `timestamp` | TIMESTAMP | NOT NULL | Thời gian ghi log |
| `level` | ENUM('DEBUG', 'INFO', 'WARN', 'ERROR') | NOT NULL | Mức độ log |
| `message` | TEXT | NOT NULL | Nội dung log |
| `log_id` | VARCHAR(100) | NULL | ID log từ metadata |
| `action` | VARCHAR(100) | NULL | Hành động được thực hiện |
| `entity` | VARCHAR(100) | NULL | Thực thể bị tác động |
| `user` | VARCHAR(100) | NULL | Người thực hiện |
| `details` | JSON | NULL | Chi tiết bổ sung |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Ghi chú:** Bảng lưu trữ toàn bộ nhật ký hoạt động của hệ thống.

---