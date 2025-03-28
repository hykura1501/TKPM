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
  export default {
    faculties,
    statuses,
    programs,
    systemConfig,
  }
  
  