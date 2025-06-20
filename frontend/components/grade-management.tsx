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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import coursesServices from "@/services/courseService"
import classSectionService from "@/services/classSectionService"
import registrationService from "@/services/registrationService"
import { ClassSection, Course } from "@/types"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

interface Grade {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  courseId: string
  courseName: string
  grade: number
  studentInfo?: any
}

export default function GradeManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("grades")
  const common = useTranslations("common")

  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<ClassSection[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")

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
      grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.studentInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredGrades(filtered)
  }, [searchTerm, grades])


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCourse")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCourses")}</SelectItem>
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
                  <SelectValue placeholder={t("selectClass")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allClasses")}</SelectItem>
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
                <TableHead>{t("studentId")}</TableHead>
                <TableHead>{t("studentName")}</TableHead>
                <TableHead>{t("class")}</TableHead>
                <TableHead>{t("course")}</TableHead>
                <TableHead className="text-center">{t("grade")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.studentId}</TableCell>
                    <TableCell>{grade?.studentInfo?.fullName}</TableCell>
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
                    {common("noData")}
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
