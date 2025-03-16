"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search, Pencil, Trash2, GraduationCap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StudentForm } from "@/components/student-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
// Define student type
export type Student = {
  mssv: string
  fullName: string
  dateOfBirth: string
  gender: "Nam" | "Nữ" | "Khác"
  faculty: "Khoa Luật" | "Khoa Tiếng Anh thương mại" | "Khoa Tiếng Nhật" | "Khoa Tiếng Pháp"
  course: string
  program: string
  address: string
  email: string
  phone: string
  status: "Đang học" | "Đã tốt nghiệp" | "Đã thôi học" | "Tạm dừng học"
}

// Status color mapping
const statusColors = {
  "Đang học": "bg-green-500",
  "Đã tốt nghiệp": "bg-blue-500",
  "Đã thôi học": "bg-red-500",
  "Tạm dừng học": "bg-yellow-500",
}

// Faculty color mapping
const facultyColors = {
  "Khoa Luật": "bg-purple-100 text-purple-800",
  "Khoa Tiếng Anh thương mại": "bg-blue-100 text-blue-800",
  "Khoa Tiếng Nhật": "bg-pink-100 text-pink-800",
  "Khoa Tiếng Pháp": "bg-amber-100 text-amber-800",
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    graduated: 0,
    dropped: 0,
    paused: 0,
  })

  // Load students data on first render
  useEffect(() => {
    async function fetchStudents() {
      const response = await fetch("/api/students")
      const data = await response.json()
      setStudents(data)
      setIsLoading(false)
    }

    fetchStudents()
    
  }, [])

  // Update stats when students change
  useEffect(() => {
    setStats({
      total: students.length,
      active: students.filter((s) => s.status === "Đang học").length,
      graduated: students.filter((s) => s.status === "Đã tốt nghiệp").length,
      dropped: students.filter((s) => s.status === "Đã thôi học").length,
      paused: students.filter((s) => s.status === "Tạm dừng học").length,
    })
  }, [students])

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mssv.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add new student
  const addStudent = async (student: Omit<Student, "mssv">) => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })

    if (response.ok) {
      const data = await response.json()
      setStudents([...students, data.student])
      setIsFormOpen(false)
    } else {
      console.error("Failed to add student")
    }
  }

  // Update student
  const updateStudent = async (updatedStudent: Student) => {
    const response = await fetch("/api/students", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent),
    })

    if (response.ok) {
      setStudents(students.map((student) => (student.mssv === updatedStudent.mssv ? updatedStudent : student)))
      setEditingStudent(null)
      setIsFormOpen(false)
    } else {
      console.error("Failed to update student")
    }
  }

  // Delete student
  const deleteStudent = async (mssv: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mssv }),
      })

      if (response.ok) {
        setStudents(students.filter((student) => student.mssv !== mssv))
      } else {
        console.error("Failed to delete student")
      }
    }
  }

  // Handle edit button click
  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  // Handle add button click
  const handleAdd = () => {
    setEditingStudent(null)
    setIsFormOpen(true)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <GraduationCap className="h-8 w-8 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">Hệ thống Quản lý Sinh viên</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "Đang tải..." : stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đang học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{isLoading ? "Đang tải..." : stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã tốt nghiệp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{isLoading ? "Đang tải..." : stats.graduated}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã thôi học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{isLoading ? "Đang tải..." : stats.dropped}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tạm dừng học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{isLoading ? "Đang tải..." : stats.paused}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Danh sách Sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc MSSV..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm Sinh viên
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingStudent ? "Cập nhật Thông tin Sinh viên" : "Thêm Sinh viên Mới"}</DialogTitle>
                    <DialogDescription>
                      {editingStudent
                        ? "Chỉnh sửa thông tin sinh viên trong biểu mẫu bên dưới."
                        : "Điền thông tin sinh viên mới vào biểu mẫu bên dưới."}
                    </DialogDescription>
                  </DialogHeader>
                  <StudentForm student={editingStudent} onSubmit={editingStudent ? updateStudent : addStudent} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>MSSV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày sinh</TableHead>
                    <TableHead className="hidden md:table-cell">Khoa</TableHead>
                    <TableHead className="hidden md:table-cell">Khóa</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.mssv} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{student.mssv}</TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className={facultyColors[student.faculty]}>
                            {student.faculty}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{student.course}</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[student.status]} text-white`}>{student.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/detail/${student.mssv}`}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(student)}
                              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteStudent(student.mssv)}
                              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        Không tìm thấy sinh viên nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 border-t py-4 mt-auto">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Hệ thống Quản lý Sinh viên
        </div>
      </footer>
    </div>
  )
}