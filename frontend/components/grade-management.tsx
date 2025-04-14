"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Edit, Trash2 } from "lucide-react"
import coursesServices from "@/services/courseService"
import { ClassSection, Course, Registration, Student } from "@/types"
import classSectionService from "@/services/classSectionService"
import registrationService from "@/services/registrationService"

export default function GradeManagement() {
  const [courses, setCourses] = useState<Course[]>([])

  const [grades, setGrades] = useState<Registration[]>([])

  useEffect(() => {
    async function fetchData() {
      const [coursesData] = await Promise.all([
        coursesServices.fetchCourses(),
      ])

      if (coursesData) {
        setCourses(coursesData)
      }
    }

    fetchData()

  }, [])

  // State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGrade, setCurrentGrade] = useState<{ id: string; score: number } | null>(null)

  const [classes, setClasses] = useState<ClassSection[]>([])

  useEffect(() => {

    async function fetchClasses(selectedCourse: string) {
      if (!selectedCourse) return
      const classesData = await classSectionService.fetchClassesByCourseId(selectedCourse)
      setClasses(classesData)
    }
    fetchClasses(selectedCourse)
  }, [selectedCourse])

  useEffect(() => {
    async function fetchGrade(selectedClass: string) {
      if (!selectedClass) return
      const gradesData = await registrationService.fetchGradesByClassId(selectedClass)
      setGrades(gradesData)
    }
    fetchGrade(selectedClass)
  }, [selectedClass])

  useEffect(() => {
    if (!searchTerm) {
      return
    }
    const filteredStudents = grades.filter((grade) => {
      return grade.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) || grade.studentInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setGrades(filteredStudents)
  }, [searchTerm])

  // Handle edit
  const handleEdit = (grade: any) => {
    setCurrentGrade({ id: grade.id, score: grade.score })
    setIsEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (grade: any) => {
    setCurrentGrade({ id: grade.id, score: grade.score })
    setIsDeleteDialogOpen(true)
  }

  // Save edited grade
  const saveGrade = () => {
    if (!currentGrade) return

    const newScore = Number.parseFloat(currentGrade.score.toString())
    if (isNaN(newScore) || newScore < 0 || newScore > 10) {
      alert("Điểm phải là số từ 0 đến 10")
      return
    }

    setGrades(grades.map((grade) => (grade.id === currentGrade.id ? { ...grade, score: newScore } : grade)))
    setIsEditDialogOpen(false)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (!currentGrade) return
    setGrades(grades.filter((grade) => grade.id !== currentGrade.id))
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Điểm</CardTitle>
        <CardDescription>Xem và quản lý điểm của sinh viên</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã hoặc tên sinh viên"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn học</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Tên sinh viên</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead className="text-center">Điểm</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades?.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.studentId}</TableCell>
                    <TableCell>{grade?.studentInfo?.fullName}</TableCell>
                    <TableCell>{classes?.find((cls) => cls.id === selectedClass)?.code}</TableCell>
                    <TableCell>{courses?.find((course) => course?.id === selectedCourse)?.name}</TableCell>
                    <TableCell className="text-center font-medium">{grade?.grade?.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(grade)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(grade)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không tìm thấy dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sửa điểm</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="score" className="text-right">
                  Điểm:
                </label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={currentGrade?.score || 0}
                  onChange={(e) => setCurrentGrade({ ...currentGrade!, score: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={saveGrade}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Bạn có chắc chắn muốn xóa điểm này?</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
