// Course type
export type Course = {
  id: string
  code: string // Unique course code
  name: string
  credits: number
  // faculty: string
  department: string
  description: string
  prerequisites: string[] // Array of course codes that are prerequisites
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Class Section type
export type ClassSection = {
  id: string
  code: string // Unique class section code
  courseId: string
  academicYear: string
  semester: string
  instructor: string
  maxCapacity: number
  currentEnrollment: number
  schedule: string
  classroom: string
  createdAt: string
}

// Student type
export type Student = {
  id: string
  studentId: string // Unique student ID
  name: string
  fullName?: string
  email: string
  department: string
  enrollmentYear: string
}

// Registration type
export type Registration = {
  id: string
  studentId: string
  classSectionId: string
  status: "active" | "cancelled"
  grade?: number
  registeredAt: string
  cancelledAt?: string
  studentInfo?: Student // Optional field to include student info
}

// Department type
export type Department = {
  id: string
  name: string
  code: string
}

// Semester type
export type Semester = "1" | "2" | "Summer"

// Grade type for transcript
export type Grade = {
  courseCode: string
  courseName: string
  credits: number
  semester: string
  academicYear: string
  grade: number
}

// Transcript type
export type Transcript = {
  student: Student
  grades: Grade[]
  gpa: number
}

