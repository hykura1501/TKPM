// Định nghĩa các kiểu dữ liệu

export type Address = {
  streetAddress: string // Số nhà, tên đường
  ward: string // Phường/Xã
  district: string // Quận/Huyện
  province: string // Tỉnh/Thành phố
  country: string // Quốc gia
}

export type CMND = {
  type: "CMND"
  number: string
  issueDate: string
  issuePlace: string
  expiryDate: string
}

export type CCCD = {
  type: "CCCD"
  number: string
  issueDate: string
  issuePlace: string
  expiryDate: string
  hasChip: boolean
}

export type Passport = {
  type: "Passport"
  number: string
  issueDate: string
  issuePlace: string
  expiryDate: string
  issuingCountry: string
  notes?: string
}

export type IdentityDocument = CMND | CCCD | Passport

export type Faculty = {
  id: string
  name: string
}

export type StudentStatus = {
  id: string
  name: string
  color: string
}

export type Program = {
  id: string
  name: string
  faculty: string // ID của khoa
}

export type Student = {
  mssv: string
  fullName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  faculty: string // ID của khoa
  course: string
  program: string // ID của chương trình
  permanentAddress?: Address
  temporaryAddress?: Address
  mailingAddress?: Address
  identityDocument?: IdentityDocument
  nationality: string
  email: string
  phone: string
  status: string // ID của tình trạng
  createdAt: string
  updatedAt: string
}

export type LogEntry = {
  id?: string
  timestamp: string,
  message: string,
  level: string,
  action?: string,
  entity?: string,
  user?: string,
  details?: string,
  entityId?: string,
  metadata?: {
    id?: string
    action: string | "create" | "update" | "delete" | "import" | "export" | "login" | "logout" | "error" 
    entity: string | "student" | "faculty" | "program" | "status" | "system"
    entityId?: string
    user: string
    details: string
  }

}

export type ImportFormat = "csv" | "json" | "xml" | "excel"

