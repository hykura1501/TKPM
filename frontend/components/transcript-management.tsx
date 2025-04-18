"use client"

import { useState } from "react"
import { Search, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Grade, Transcript } from "@/types"
import {
  students,
  registrations,
  getCourseById,
  getStudentById,
  getClassSectionById,
  departments,
} from "@/data/sample-data"

// Mock departments data (replace with actual data fetching if needed)
// const departments = [
//   { id: "1", name: "Khoa CNTT" },
//   { id: "2", name: "Khoa Điện tử Viễn thông" },
//   { id: "3", name: "Khoa Cơ khí" },
//   { id: "4", name: "Khoa Xây dựng" },
// ];

export function TranscriptManagement() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Generate transcript for selected student
  const generateTranscript = (studentId: string): Transcript | null => {
    const student = getStudentById(studentId)
    if (!student) return null

    // Get all active registrations for the student
    const studentRegistrations = registrations.filter((reg) => reg.studentId === studentId && reg.status === "active")

    // Convert registrations to grades
    const grades: Grade[] = studentRegistrations
      .filter((reg) => reg.grade !== undefined) // Only include registrations with grades
      .map((reg) => {
        const classSection = getClassSectionById(reg.classSectionId)
        if (!classSection) return null

        const course = getCourseById(classSection.courseId)
        if (!course) return null

        return {
          courseCode: course.code,
          courseName: course.name,
          credits: course.credits,
          semester: classSection.semester,
          academicYear: classSection.academicYear,
          grade: reg.grade as number,
        }
      })
      .filter(Boolean) as Grade[]

    // Calculate GPA
    let totalCredits = 0
    let totalGradePoints = 0

    grades.forEach((grade) => {
      totalCredits += grade.credits
      totalGradePoints += grade.credits * grade.grade
    })

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

    return {
      student,
      grades,
      gpa,
    }
  }

  // Get transcript for selected student
  const transcript = selectedStudentId ? generateTranscript(selectedStudentId) : null

  // Print transcript
  const printTranscript = () => {
    if (!transcript) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn sinh viên trước khi in bảng điểm.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would generate a PDF and trigger a print dialog
    // For now, we'll just show a toast
    toast({
      title: "Đang in bảng điểm",
      description: `Đang in bảng điểm cho sinh viên ${transcript.student.name}.`,
    })
  }

  // Export transcript as PDF
  const exportTranscript = () => {
    if (!transcript) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn sinh viên trước khi xuất bảng điểm.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would generate a PDF and trigger a download
    // For now, we'll just show a toast
    toast({
      title: "Đang xuất bảng điểm",
      description: `Đang xuất bảng điểm cho sinh viên ${transcript.student.name} sang PDF.`,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bảng điểm Sinh viên</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={printTranscript}
            disabled={!transcript}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            In bảng điểm
          </Button>
          <Button
            variant="outline"
            onClick={exportTranscript}
            disabled={!transcript}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Xuất PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Chọn sinh viên để xem bảng điểm" />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.studentId} - {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {transcript ? (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-bold text-center mb-4">BẢNG ĐIỂM CHÍNH THỨC</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Mã sinh viên:</p>
                  <p className="font-medium">{transcript.student.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Họ và tên:</p>
                  <p className="font-medium">{transcript.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khoa:</p>
                  <p className="font-medium">
                    {departments.find((d) => d.id === transcript.student.department)?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Năm nhập học:</p>
                  <p className="font-medium">{transcript.student.enrollmentYear}</p>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Mã môn</TableHead>
                    <TableHead>Tên môn học</TableHead>
                    <TableHead className="text-center">Số tín chỉ</TableHead>
                    <TableHead className="text-center">Học kỳ</TableHead>
                    <TableHead className="text-center">Năm học</TableHead>
                    <TableHead className="text-center">Điểm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcript.grades.length > 0 ? (
                    transcript.grades.map((grade, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{grade.courseCode}</TableCell>
                        <TableCell>{grade.courseName}</TableCell>
                        <TableCell className="text-center">{grade.credits}</TableCell>
                        <TableCell className="text-center">
                          {grade.semester === "1" ? "I" : grade.semester === "2" ? "II" : "Hè"}
                        </TableCell>
                        <TableCell className="text-center">{grade.academicYear}</TableCell>
                        <TableCell className="text-center font-bold">{grade.grade.toFixed(1)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        Sinh viên chưa có điểm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Điểm trung bình tích lũy (GPA):</p>
                  <p className="text-xl font-bold text-blue-600">{transcript.gpa.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-8 bg-white text-center text-gray-500">
            Vui lòng chọn sinh viên để xem bảng điểm
          </div>
        )}
      </CardContent>
    </Card>
  )
}

