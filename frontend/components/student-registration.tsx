"use client"

import { useState } from "react"
import { PlusCircle, Search, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Registration } from "@/types"
import {
  registrations as initialRegistrations,
  students,
  classSections,
  getCourseById,
  getStudentById,
  getClassSectionById,
} from "@/data/sample-data"
import { RegistrationForm } from "@/components/registration-form"

export function StudentRegistration() {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter((registration) => {
    const student = getStudentById(registration.studentId)
    const classSection = getClassSectionById(registration.classSectionId)
    const course = classSection ? getCourseById(classSection.courseId) : null

    return (
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classSection?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Add new registration
  const addRegistration = (data: { studentId: string; classSectionId: string }) => {
    // Check if student exists
    const student = getStudentById(data.studentId)
    if (!student) {
      toast({
        title: "Lỗi",
        description: "Sinh viên không tồn tại trong hệ thống.",
        variant: "destructive",
      })
      return
    }

    // Check if class section exists
    const classSection = getClassSectionById(data.classSectionId)
    if (!classSection) {
      toast({
        title: "Lỗi",
        description: "Lớp học không tồn tại trong hệ thống.",
        variant: "destructive",
      })
      return
    }

    // Check if class is full
    if (classSection.currentEnrollment >= classSection.maxCapacity) {
      toast({
        title: "Lỗi",
        description: "Lớp học đã đủ sĩ số tối đa.",
        variant: "destructive",
      })
      return
    }

    // Check if student is already registered for this class
    if (
      registrations.some(
        (r) => r.studentId === data.studentId && r.classSectionId === data.classSectionId && r.status === "active",
      )
    ) {
      toast({
        title: "Lỗi",
        description: "Sinh viên đã đăng ký lớp học này.",
        variant: "destructive",
      })
      return
    }

    // Check prerequisites
    const course = getCourseById(classSection.courseId)
    if (course && course.prerequisites.length > 0) {
      // Get all courses the student has completed
      const completedCourses = registrations
        .filter((r) => r.studentId === data.studentId && r.status === "active" && r.grade && r.grade >= 5)
        .map((r) => {
          const section = getClassSectionById(r.classSectionId)
          if (!section) return null
          const course = getCourseById(section.courseId)
          return course?.code || null
        })
        .filter(Boolean) as string[]

      // Check if all prerequisites are met
      const missingPrerequisites = course.prerequisites.filter((prereq) => !completedCourses.includes(prereq))

      if (missingPrerequisites.length > 0) {
        toast({
          title: "Lỗi",
          description: `Sinh viên chưa hoàn thành các môn tiên quyết: ${missingPrerequisites.join(", ")}`,
          variant: "destructive",
        })
        return
      }
    }

    // Create new registration
    const newRegistration: Registration = {
      id: `reg-${registrations.length + 1}`,
      studentId: data.studentId,
      classSectionId: data.classSectionId,
      status: "active",
      registeredAt: new Date().toISOString(),
    }

    setRegistrations([...registrations, newRegistration])

    // Update class section enrollment count
    const updatedClassSections = classSections.map((section) =>
      section.id === data.classSectionId ? { ...section, currentEnrollment: section.currentEnrollment + 1 } : section,
    )

    setIsFormOpen(false)

    toast({
      title: "Thành công",
      description: `Đã đăng ký khóa học cho sinh viên ${student.name}.`,
    })
  }

  // Cancel registration
  const cancelRegistration = (id: string) => {
    const registrationToCancel = registrations.find((r) => r.id === id)
    if (!registrationToCancel) return

    // Check if registration can be cancelled (e.g., within a certain time period)
    const registeredAt = new Date(registrationToCancel.registeredAt)
    const now = new Date()
    const daysDiff = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24)

    // Assume there's a deadline of 14 days after registration
    if (daysDiff > 14) {
      toast({
        title: "Không thể hủy đăng ký",
        description: "Đã quá thời hạn hủy đăng ký (14 ngày sau khi đăng ký).",
        variant: "destructive",
      })
      return
    }

    // Update registration status
    setRegistrations(
      registrations.map((registration) =>
        registration.id === id
          ? { ...registration, status: "cancelled", cancelledAt: new Date().toISOString() }
          : registration,
      ),
    )

    // Update class section enrollment count
    const classSection = getClassSectionById(registrationToCancel.classSectionId)
    if (classSection && registrationToCancel.status === "active") {
      const updatedClassSections = classSections.map((section) =>
        section.id === registrationToCancel.classSectionId
          ? { ...section, currentEnrollment: Math.max(0, section.currentEnrollment - 1) }
          : section,
      )
    }

    toast({
      title: "Đã hủy đăng ký",
      description: "Đã hủy đăng ký khóa học cho sinh viên.",
    })
  }

  // Handle add button click
  const handleAdd = () => {
    setIsFormOpen(true)
  }

  // Get student name by ID
  const getStudentName = (studentId: string): string => {
    const student = getStudentById(studentId)
    return student ? student.name : "Unknown Student"
  }

  // Get class section and course info
  const getClassInfo = (classSectionId: string): { sectionCode: string; courseName: string } => {
    const section = getClassSectionById(classSectionId)
    if (!section) return { sectionCode: "Unknown", courseName: "Unknown" }

    const course = getCourseById(section.courseId)
    return {
      sectionCode: section.code,
      courseName: course ? course.name : "Unknown Course",
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Đăng ký Khóa học cho Sinh viên</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Đăng ký Khóa học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Đăng ký Khóa học cho Sinh viên</DialogTitle>
            </DialogHeader>
            <RegistrationForm
              onSubmit={addRegistration}
              students={students}
              classSections={classSections.filter((section) => section.currentEnrollment < section.maxCapacity)}
              courses={classSections.map((section) => getCourseById(section.courseId)).filter(Boolean) as any}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sinh viên, mã sinh viên, lớp học..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Tên sinh viên</TableHead>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration) => {
                  const student = getStudentById(registration.studentId)
                  const classInfo = getClassInfo(registration.classSectionId)

                  return (
                    <TableRow key={registration.id} className="hover:bg-gray-50">
                      <TableCell>{student?.studentId}</TableCell>
                      <TableCell>{getStudentName(registration.studentId)}</TableCell>
                      <TableCell>{classInfo.sectionCode}</TableCell>
                      <TableCell>{classInfo.courseName}</TableCell>
                      <TableCell>{new Date(registration.registeredAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        {registration.status === "active" ? (
                          <Badge className="bg-green-500 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Đang học
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Đã hủy
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {registration.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelRegistration(registration.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hủy đăng ký
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Không tìm thấy đăng ký nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

