"use client"

import { useState } from "react"
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Course } from "@/types/index"
import { courses as initialCourses, departments, getDepartmentName } from "@/data/sample-data"
import { CourseForm } from "@/components/course-form"

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add new course
  const addCourse = (course: Omit<Course, "id" | "createdAt" | "updatedAt" | "isActive">) => {
    // Check if course code already exists
    if (courses.some((c) => c.code === course.code)) {
      toast({
        title: "Lỗi",
        description: "Mã khóa học đã tồn tại trong hệ thống.",
        variant: "destructive",
      })
      return
    }

    // Validate prerequisites
    for (const prereqCode of course.prerequisites) {
      if (!courses.some((c) => c.code === prereqCode)) {
        toast({
          title: "Lỗi",
          description: `Môn tiên quyết ${prereqCode} không tồn tại trong hệ thống.`,
          variant: "destructive",
        })
        return
      }
    }

    const now = new Date().toISOString()
    const newCourse: Course = {
      ...course,
      id: `course-${courses.length + 1}`,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }

    setCourses([...courses, newCourse])
    setIsFormOpen(false)

    toast({
      title: "Thành công",
      description: `Đã thêm khóa học ${course.name} vào hệ thống.`,
    })
  }

  // Update course
  const updateCourse = (updatedCourse: Course) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? { ...updatedCourse, updatedAt: new Date().toISOString() } : course,
      ),
    )
    setEditingCourse(null)
    setIsFormOpen(false)

    toast({
      title: "Thành công",
      description: `Đã cập nhật thông tin khóa học ${updatedCourse.name}.`,
    })
  }

  // Delete course
  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find((c) => c.id === id)
    if (!courseToDelete) return

    // Check if course can be deleted (within 30 minutes of creation)
    const createdAt = new Date(courseToDelete.createdAt)
    const now = new Date()
    const timeDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60) // in minutes

    if (timeDiff > 30) {
      toast({
        title: "Không thể xóa",
        description: "Chỉ có thể xóa khóa học trong vòng 30 phút sau khi tạo.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would check if there are any class sections for this course
    // For now, we'll just simulate this check
    const hasClassSections = Math.random() > 0.7 // 30% chance of having class sections

    if (hasClassSections) {
      // Deactivate instead of delete
      setCourses(
        courses.map((course) =>
          course.id === id ? { ...course, isActive: false, updatedAt: new Date().toISOString() } : course,
        ),
      )

      toast({
        title: "Khóa học đã bị vô hiệu hóa",
        description: "Khóa học đã có lớp học, nên chỉ có thể vô hiệu hóa thay vì xóa.",
        variant: "warning",
      })
    } else {
      // Delete the course
      setCourses(courses.filter((course) => course.id !== id))

      toast({
        title: "Đã xóa khóa học",
        description: `Khóa học ${courseToDelete.name} đã được xóa khỏi hệ thống.`,
      })
    }
  }

  // Handle edit button click
  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setIsFormOpen(true)
  }

  // Handle add button click
  const handleAdd = () => {
    setEditingCourse(null)
    setIsFormOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Khóa học</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm Khóa học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Cập nhật Thông tin Khóa học" : "Thêm Khóa học Mới"}</DialogTitle>
            </DialogHeader>
            <CourseForm
              course={editingCourse}
              onSubmit={editingCourse ? updateCourse : addCourse}
              departments={departments}
              existingCourses={courses}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
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
                <TableHead>Mã khóa học</TableHead>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Số tín chỉ</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>Môn tiên quyết</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{getDepartmentName(course.department)}</TableCell>
                    <TableCell>
                      {course.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq) => (
                            <Badge key={prereq} variant="outline">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "Không có"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={course.isActive ? "bg-green-500" : "bg-red-500"}>
                        {course.isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(course)}
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteCourse(course.id)}
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Không tìm thấy khóa học nào
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

