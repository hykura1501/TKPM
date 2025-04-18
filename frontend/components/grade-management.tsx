"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, Edit, Trash2 } from "lucide-react"
import coursesServices from "@/services/courseService"
import classSectionService from "@/services/classSectionService"
import registrationService from "@/services/registrationService"
import { ClassSection, Course, Registration } from "@/types"
import { useSearchParams, useRouter } from "next/navigation"

export default function GradeManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<ClassSection[]>([])
  const [grades, setGrades] = useState<Registration[]>([])
  const [filteredGrades, setFilteredGrades] = useState<Registration[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<string>("all")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGrade, setCurrentGrade] = useState<{ id: string; grade: number } | null>(null)

  const handleCourseChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === "all") {
        params.delete("courseId")
        params.delete("classId")
        router.push(`?${params.toString()}`)
        setSelectedCourse("all")
        setSelectedClass("all")
        setGrades([])
        return
      }

      params.set("courseId", value)
      params.delete("classId")
      router.push(`?${params.toString()}`)
      setSelectedCourse(value)
      setSelectedClass("all")
      setGrades([])
    },
    [router, searchParams]
  )

  const handleClassChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === "all") {
        params.delete("classId")
        router.push(`?${params.toString()}`)
        setSelectedClass("all")
        return
      }

      params.set("classId", value)
      router.push(`?${params.toString()}`)
      setSelectedClass(value)
    },
    [router, searchParams]
  )

  useEffect(() => {
    async function fetchInitialData() {
      const coursesData = await coursesServices.fetchCourses()
      if (coursesData) setCourses(coursesData)

      const courseId = searchParams.get("courseId") || "all"
      const classId = searchParams.get("classId") || "all"

      setSelectedCourse(courseId)
      setSelectedClass(classId)
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    async function fetchClasses() {
      if (!selectedCourse || selectedCourse === "all") return
      const data = await classSectionService.fetchClassesByCourseId(selectedCourse)
      setClasses(data)
    }
    fetchClasses()
  }, [selectedCourse])

  useEffect(() => {
    async function fetchGrades() {
      if (!selectedClass || selectedClass === "all") return
      const data = await registrationService.fetchGradesByClassId(selectedClass)
      setGrades(data)
      setFilteredGrades(data)
    }
    fetchGrades()
  }, [selectedClass])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredGrades(grades)
      return
    }
    const filtered = grades.filter((grade) =>
      grade.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.studentInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredGrades(filtered)
  }, [searchTerm, grades])

  const handleEdit = (grade: Registration) => {
    setCurrentGrade({ id: grade.id, grade: grade.grade ?? 0 })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (grade: Registration) => {
    setCurrentGrade({ id: grade.id, grade: grade.grade ?? 0 })
    setIsDeleteDialogOpen(true)
  }

  const saveGrade = () => {
    if (!currentGrade) return
    const newScore = parseFloat(currentGrade.grade.toString())
    if (isNaN(newScore) || newScore < 0 || newScore > 10) {
      alert("Điểm phải là số từ 0 đến 10")
      return
    }
    setGrades((prev) =>
      prev.map((g) => (g.id === currentGrade.id ? { ...g, score: newScore } : g))
    )
    setFilteredGrades((prev) =>
      prev.map((g) => (g.id === currentGrade.id ? { ...g, score: newScore } : g))
    )
    setIsEditDialogOpen(false)
  }

  const confirmDelete = () => {
    if (!currentGrade) return
    setGrades((prev) => prev.filter((g) => g.id !== currentGrade.id))
    setFilteredGrades((prev) => prev.filter((g) => g.id !== currentGrade.id))
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
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
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
              <Select value={selectedClass} onValueChange={handleClassChange}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.studentId}</TableCell>
                    <TableCell>{grade.studentInfo?.fullName}</TableCell>
                    <TableCell>{classes.find((cls) => cls.id === selectedClass)?.code}</TableCell>
                    <TableCell>{courses.find((course) => course.id === selectedCourse)?.name}</TableCell>
                    <TableCell className="text-center font-medium">
                      {grade?.grade?.toFixed(1)}
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
      </CardContent>
    </Card>
  )
}
