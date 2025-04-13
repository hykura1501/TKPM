import type { Course, ClassSection, Student, Registration, Department } from "@/types"
import { Faculty } from "@/types/student"

// Sample departments
export const departments: Department[] = [
  { id: "dept-1", name: "Khoa Công nghệ Thông tin", code: "CNTT" },
  { id: "dept-2", name: "Khoa Kinh tế", code: "KT" },
  { id: "dept-3", name: "Khoa Ngoại ngữ", code: "NN" },
  { id: "dept-4", name: "Khoa Điện - Điện tử", code: "DĐT" },
]

// Sample courses
export const courses: Course[] = [
  {
    id: "course-1",
    code: "CNTT001",
    name: "Nhập môn Lập trình",
    credits: 3,
    department: "dept-1",
    description: "Khóa học cơ bản về lập trình cho sinh viên năm nhất.",
    prerequisites: [],
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "course-2",
    code: "CNTT002",
    name: "Cấu trúc dữ liệu và Giải thuật",
    credits: 4,
    department: "dept-1",
    description: "Khóa học về cấu trúc dữ liệu và các thuật toán cơ bản.",
    prerequisites: ["CNTT001"],
    isActive: true,
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "course-3",
    code: "CNTT003",
    name: "Cơ sở dữ liệu",
    credits: 4,
    department: "dept-1",
    description: "Khóa học về thiết kế và quản lý cơ sở dữ liệu.",
    prerequisites: ["CNTT001"],
    isActive: true,
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
  {
    id: "course-4",
    code: "KT001",
    name: "Kinh tế vĩ mô",
    credits: 3,
    department: "dept-2",
    description: "Khóa học cơ bản về kinh tế vĩ mô.",
    prerequisites: [],
    isActive: true,
    createdAt: "2023-01-04T00:00:00Z",
    updatedAt: "2023-01-04T00:00:00Z",
  },
  {
    id: "course-5",
    code: "NN001",
    name: "Tiếng Anh cơ bản",
    credits: 2,
    department: "dept-3",
    description: "Khóa học tiếng Anh cơ bản cho sinh viên năm nhất.",
    prerequisites: [],
    isActive: true,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
  },
]

// Sample class sections
export const classSections: ClassSection[] = [
  {
    id: "section-1",
    code: "CNTT001-01",
    courseId: "course-1",
    academicYear: "2023-2024",
    semester: "1",
    instructor: "Nguyễn Văn A",
    maxCapacity: 40,
    currentEnrollment: 35,
    schedule: "Thứ 2, 7:30 - 9:30",
    classroom: "A101",
    createdAt: "2023-08-01T00:00:00Z",
  },
  {
    id: "section-2",
    code: "CNTT001-02",
    courseId: "course-1",
    academicYear: "2023-2024",
    semester: "1",
    instructor: "Trần Thị B",
    maxCapacity: 40,
    currentEnrollment: 38,
    schedule: "Thứ 3, 7:30 - 9:30",
    classroom: "A102",
    createdAt: "2023-08-01T00:00:00Z",
  },
  {
    id: "section-3",
    code: "CNTT002-01",
    courseId: "course-2",
    academicYear: "2023-2024",
    semester: "1",
    instructor: "Lê Văn C",
    maxCapacity: 35,
    currentEnrollment: 30,
    schedule: "Thứ 4, 9:30 - 11:30",
    classroom: "B201",
    createdAt: "2023-08-02T00:00:00Z",
  },
  {
    id: "section-4",
    code: "KT001-01",
    courseId: "course-4",
    academicYear: "2023-2024",
    semester: "1",
    instructor: "Phạm Thị D",
    maxCapacity: 50,
    currentEnrollment: 45,
    schedule: "Thứ 5, 13:30 - 15:30",
    classroom: "C301",
    createdAt: "2023-08-03T00:00:00Z",
  },
]

// Sample students
export const students: Student[] = [
  {
    id: "student-1",
    studentId: "SV001",
    name: "Nguyễn Văn X",
    email: "nguyenvanx@example.com",
    department: "dept-1",
    enrollmentYear: "2022",
  },
  {
    id: "student-2",
    studentId: "SV002",
    name: "Trần Thị Y",
    email: "tranthiy@example.com",
    department: "dept-1",
    enrollmentYear: "2022",
  },
  {
    id: "student-3",
    studentId: "SV003",
    name: "Lê Văn Z",
    email: "levanz@example.com",
    department: "dept-2",
    enrollmentYear: "2021",
  },
  {
    id: "student-4",
    studentId: "SV004",
    name: "Phạm Thị W",
    email: "phamthiw@example.com",
    department: "dept-3",
    enrollmentYear: "2023",
  },
]

// Sample registrations
export const registrations: Registration[] = [
  {
    id: "reg-1",
    studentId: "student-1",
    classSectionId: "section-1",
    status: "active",
    registeredAt: "2023-08-15T00:00:00Z",
  },
  {
    id: "reg-2",
    studentId: "student-1",
    classSectionId: "section-3",
    status: "active",
    registeredAt: "2023-08-15T00:00:00Z",
  },
  {
    id: "reg-3",
    studentId: "student-2",
    classSectionId: "section-1",
    status: "active",
    registeredAt: "2023-08-16T00:00:00Z",
  },
  {
    id: "reg-4",
    studentId: "student-3",
    classSectionId: "section-4",
    status: "active",
    registeredAt: "2023-08-17T00:00:00Z",
  },
  {
    id: "reg-5",
    studentId: "student-4",
    classSectionId: "section-2",
    status: "cancelled",
    registeredAt: "2023-08-18T00:00:00Z",
    cancelledAt: "2023-08-20T00:00:00Z",
  },
]

// Helper function to get department name by ID
export const getDepartmentName = (facultyId: string, faculties: Faculty[]): string => {
  const faculty = faculties.find((dept) => dept.id === facultyId)
  return faculty ? faculty.name : "Unknown Faculty"
}

// Helper function to get course by ID
export const getCourseById = (courseId: string): Course | undefined => {
  return courses.find((course) => course.id === courseId)
}

// Helper function to get course by code
export const getCourseByCode = (courseCode: string): Course | undefined => {
  return courses.find((course) => course.code === courseCode)
}

// Helper function to get student by ID
export const getStudentById = (studentId: string): Student | undefined => {
  return students.find((student) => student.id === studentId)
}

// Helper function to get class section by ID
export const getClassSectionById = (sectionId: string): ClassSection | undefined => {
  return classSections.find((section) => section.id === sectionId)
}

