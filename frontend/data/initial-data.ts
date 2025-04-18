import type {
  Student,
  Faculty,
  StudentStatus,
  Program,
  LogEntry,
  SystemConfig,
  StatusTransitionRule,
  PhoneFormat,
} from "@/types/student"

// Dữ liệu mẫu cho khoa
const faculties: Faculty[] = [
  { id: "faculty-1", name: "Khoa Luật" },
  { id: "faculty-2", name: "Khoa Tiếng Anh thương mại" },
  { id: "faculty-3", name: "Khoa Tiếng Nhật" },
  { id: "faculty-4", name: "Khoa Tiếng Pháp" },
]

// Dữ liệu mẫu cho tình trạng sinh viên
const statuses: StudentStatus[] = [
  { id: "status-1", name: "Đang học", color: "#22c55e" },
  { id: "status-2", name: "Đã tốt nghiệp", color: "#3b82f6" },
  { id: "status-3", name: "Đã thôi học", color: "#ef4444" },
  { id: "status-4", name: "Tạm dừng học", color: "#f59e0b" },
]

// Dữ liệu mẫu cho chương trình học
const programs: Program[] = [
  { id: "program-1", name: "Cử nhân Luật", faculty: "faculty-1" },
  { id: "program-2", name: "Thạc sĩ Luật", faculty: "faculty-1" },
  { id: "program-3", name: "Cử nhân Tiếng Anh thương mại", faculty: "faculty-2" },
  { id: "program-4", name: "Thạc sĩ Tiếng Anh thương mại", faculty: "faculty-2" },
  { id: "program-5", name: "Cử nhân Tiếng Nhật", faculty: "faculty-3" },
  { id: "program-6", name: "Cử nhân Tiếng Pháp", faculty: "faculty-4" },
]

// Dữ liệu mẫu cho sinh viên
const students: Student[] = [
  {
    id: "SV001",
    fullName: "Nguyễn Văn A",
    dateOfBirth: "2000-01-15",
    gender: "male",
    faculty: "faculty-1",
    course: "2020",
    program: "program-1",
    permanentAddress: {
      streetAddress: "123 Đường Nguyễn Huệ",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    temporaryAddress: {
      streetAddress: "456 Đường Lê Lợi",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    mailingAddress: {
      streetAddress: "123 Đường Nguyễn Huệ",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "CCCD",
      number: "079200012345",
      issueDate: "2020-01-01",
      issuePlace: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
      expiryDate: "2030-01-01",
      hasChip: true,
    },
    nationality: "Việt Nam",
    email: "nguyenvana@hcmut.edu.vn",
    phone: "0901234567",
    status: "status-1",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "SV002",
    fullName: "Trần Thị B",
    dateOfBirth: "2001-05-20",
    gender: "female",
    faculty: "faculty-2",
    course: "2021",
    program: "program-3",
    permanentAddress: {
      streetAddress: "789 Đường Lý Tự Trọng",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    mailingAddress: {
      streetAddress: "789 Đường Lý Tự Trọng",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "CMND",
      number: "123456789",
      issueDate: "2019-05-15",
      issuePlace: "CA TP. Hồ Chí Minh",
      expiryDate: "2029-05-15",
    },
    nationality: "Việt Nam",
    email: "tranthib@gmail.com",
    phone: "0909876543",
    status: "status-1",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "SV003",
    fullName: "Lê Văn C",
    dateOfBirth: "1999-08-10",
    gender: "male",
    faculty: "faculty-3",
    course: "2019",
    program: "program-5",
    permanentAddress: {
      streetAddress: "101 Đường Hai Bà Trưng",
      ward: "Phường Tân Định",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    mailingAddress: {
      streetAddress: "101 Đường Hai Bà Trưng",
      ward: "Phường Tân Định",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "Passport",
      number: "P1234567",
      issueDate: "2018-10-01",
      issuePlace: "Cục Quản lý Xuất nhập cảnh",
      expiryDate: "2028-10-01",
      issuingCountry: "Việt Nam",
      notes: "Hộ chiếu phổ thông",
    },
    nationality: "Việt Nam",
    email: "levanc@student.hcmus.edu.vn",
    phone: "0912345678",
    status: "status-2",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
  {
    id: "SV004",
    fullName: "Phạm Thị D",
    dateOfBirth: "2002-03-25",
    gender: "female",
    faculty: "faculty-4",
    course: "2022",
    program: "program-6",
    permanentAddress: {
      streetAddress: "202 Đường Nguyễn Thị Minh Khai",
      ward: "Phường Đa Kao",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    mailingAddress: {
      streetAddress: "202 Đường Nguyễn Thị Minh Khai",
      ward: "Phường Đa Kao",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "CCCD",
      number: "079202012345",
      issueDate: "2020-04-01",
      issuePlace: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
      expiryDate: "2030-04-01",
      hasChip: true,
    },
    nationality: "Việt Nam",
    email: "phamthid@outlook.com",
    phone: "0987654321",
    status: "status-1",
    createdAt: "2023-01-04T00:00:00.000Z",
    updatedAt: "2023-01-04T00:00:00.000Z",
  },
  {
    id: "SV005",
    fullName: "Hoàng Văn E",
    dateOfBirth: "2000-11-30",
    gender: "male",
    faculty: "faculty-1",
    course: "2020",
    program: "program-1",
    permanentAddress: {
      streetAddress: "303 Đường Võ Văn Tần",
      ward: "Phường 5",
      district: "Quận 3",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    mailingAddress: {
      streetAddress: "303 Đường Võ Văn Tần",
      ward: "Phường 5",
      district: "Quận 3",
      province: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "CMND",
      number: "987654321",
      issueDate: "2018-12-01",
      issuePlace: "CA TP. Hồ Chí Minh",
      expiryDate: "2028-12-01",
    },
    nationality: "Việt Nam",
    email: "hoangvane@yahoo.com",
    phone: "0976543210",
    status: "status-4",
    createdAt: "2023-01-05T00:00:00.000Z",
    updatedAt: "2023-01-05T00:00:00.000Z",
  },
]

// Dữ liệu mẫu cho nhật ký
const logs: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "2023-01-01T08:00:00.000Z",
    action: "create",
    entity: "student",
    entityId: "SV001",
    user: "admin",
    details: "Tạo sinh viên mới: Nguyễn Văn A",
  },
  {
    id: "log-2",
    timestamp: "2023-01-02T09:15:00.000Z",
    action: "create",
    entity: "student",
    entityId: "SV002",
    user: "admin",
    details: "Tạo sinh viên mới: Trần Thị B",
  },
  {
    id: "log-3",
    timestamp: "2023-01-03T10:30:00.000Z",
    action: "create",
    entity: "student",
    entityId: "SV003",
    user: "admin",
    details: "Tạo sinh viên mới: Lê Văn C",
  },
  {
    id: "log-4",
    timestamp: "2023-01-04T11:45:00.000Z",
    action: "create",
    entity: "student",
    entityId: "SV004",
    user: "admin",
    details: "Tạo sinh viên mới: Phạm Thị D",
  },
  {
    id: "log-5",
    timestamp: "2023-01-05T13:00:00.000Z",
    action: "create",
    entity: "student",
    entityId: "SV005",
    user: "admin",
    details: "Tạo sinh viên mới: Hoàng Văn E",
  },
  {
    id: "log-6",
    timestamp: "2023-01-10T14:30:00.000Z",
    action: "update",
    entity: "student",
    entityId: "SV003",
    user: "admin",
    details: "Cập nhật thông tin sinh viên: Lê Văn C - Đã tốt nghiệp",
  },
  {
    id: "log-7",
    timestamp: "2023-01-15T15:45:00.000Z",
    action: "update",
    entity: "student",
    entityId: "SV005",
    user: "admin",
    details: "Cập nhật thông tin sinh viên: Hoàng Văn E - Tạm dừng học",
  },
  {
    id: "log-8",
    timestamp: "2023-01-20T09:00:00.000Z",
    action: "login",
    entity: "system",
    user: "admin",
    details: "Đăng nhập hệ thống",
  },
  {
    id: "log-9",
    timestamp: "2023-01-20T17:00:00.000Z",
    action: "logout",
    entity: "system",
    user: "admin",
    details: "Đăng xuất hệ thống",
  },
  {
    id: "log-10",
    timestamp: "2023-01-25T10:00:00.000Z",
    action: "export",
    entity: "student",
    user: "admin",
    details: "Xuất dữ liệu sinh viên sang định dạng CSV",
  },
]

// Dữ liệu mẫu cho cấu hình hệ thống
const phoneFormats: PhoneFormat[] = [
  {
    countryCode: "VN",
    countryName: "Việt Nam",
    pattern: "^(0|\\+84)[3|5|7|8|9][0-9]{8}$",
    example: "0901234567 hoặc +84901234567",
    prefix: "+84",
  },
  {
    countryCode: "US",
    countryName: "Hoa Kỳ",
    pattern: "^(\\+1)?[0-9]{10}$",
    example: "1234567890 hoặc +11234567890",
    prefix: "+1",
  },
  {
    countryCode: "JP",
    countryName: "Nhật Bản",
    pattern: "^(\\+81|0)[0-9]{9,10}$",
    example: "0123456789 hoặc +81123456789",
    prefix: "+81",
  },
  {
    countryCode: "FR",
    countryName: "Pháp",
    pattern: "^(\\+33|0)[1-9][0-9]{8}$",
    example: "0123456789 hoặc +33123456789",
    prefix: "+33",
  },
]

// Quy tắc chuyển đổi tình trạng
const statusTransitionRules: StatusTransitionRule[] = [
  {
    fromStatus: "status-1", // Đang học
    toStatus: ["status-2", "status-3", "status-4"], // Có thể chuyển sang tốt nghiệp, thôi học, tạm dừng
  },
  {
    fromStatus: "status-4", // Tạm dừng học
    toStatus: ["status-1", "status-3"], // Có thể chuyển sang đang học hoặc thôi học
  },
  {
    fromStatus: "status-2", // Đã tốt nghiệp
    toStatus: [], // Không thể chuyển sang trạng thái khác
  },
  {
    fromStatus: "status-3", // Đã thôi học
    toStatus: ["status-1"], // Có thể chuyển sang đang học (nhập học lại)
  },
]

// Tên miền email được phép
const allowedEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "hcmus.edu.vn",
  "hcmut.edu.vn",
  "student.hcmus.edu.vn",
]

// Cấu hình hệ thống
const systemConfig: SystemConfig = {
  allowedEmailDomains,
  phoneFormats,
  statusTransitionRules,
}

// Xuất dữ liệu mẫu
export const initialData = {
  faculties,
  statuses,
  programs,
  students,
  logs,
  systemConfig,
}

