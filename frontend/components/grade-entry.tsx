"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ClassSection, Course, Registration } from "@/types"
import classSectionService from "@/services/classSectionService"
import registrationService from "@/services/registrationService"
import coursesServices from "@/services/courseService"
import { toast } from "react-toastify";

export default function GradeEntry() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseIdFromUrl = searchParams.get("courseId")
  const classIdFromUrl = searchParams.get("classId")

  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<ClassSection[]>([])
  const [grades, setGrades] = useState<Registration[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [studentGrades, setStudentGrades] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchData() {
      const coursesData = await coursesServices.fetchCourses()
      if (coursesData) {
        setCourses(coursesData)
        if (courseIdFromUrl) {
          setSelectedCourse(courseIdFromUrl)
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchClasses(courseId: string) {
      if (!courseId) return
      const classesData = await classSectionService.fetchClassesByCourseId(courseId)
      setClasses(classesData)
    }
    fetchClasses(selectedCourse)
  }, [selectedCourse])

  useEffect(() => {
    if (classIdFromUrl && classes.length > 0) {
      const matchedClass = classes.find(cls => cls.id === classIdFromUrl)
      if (matchedClass) {
        setSelectedClass(classIdFromUrl)
      }
    }
  }, [classes])

  useEffect(() => {
    async function fetchGrade(classId: string) {
      if (!classId) return
      const gradesData = await registrationService.fetchGradesByClassId(classId)
      setGrades(gradesData)
    }
    fetchGrade(selectedClass)
  }, [selectedClass])

  const handleGradeChange = (studentId: string, value: string) => {
    setStudentGrades({
      ...studentGrades,
      [studentId]: value,
    })
  }

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value)
    setSelectedClass("")
    setGrades([])
    setStudentGrades({})
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("courseId", value)
    newParams.delete("classId")
    router.replace(`?${newParams.toString()}`)
  }

  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    setGrades([])
    setStudentGrades({})
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("classId", value)
    router.replace(`?${newParams.toString()}`)
  }

  const saveGrades = async () => {
    const invalidGrades = Object.entries(studentGrades).filter(([_, value]) => {
      const score = Number.parseFloat(value)
      return isNaN(score) || score < 0 || score > 10
    })

    if (invalidGrades.length > 0) {
      alert("Điểm phải là số từ 0 đến 10")
      return
    }

    await registrationService.saveGradesByClassId(selectedClass, studentGrades)
    toast.success("Lưu điểm thành công")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập Điểm</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course">Môn học</Label>
                <Select value={selectedCourse} onValueChange={handleCourseChange}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="class">Lớp</Label>
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedCourse && selectedClass ? (
              <>
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
                    {grades?.length > 0 ? (
                      grades?.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.studentInfo?.fullName}</TableCell>
                          <TableCell>{classes.find((cls) => cls.id === selectedClass)?.code}</TableCell>
                          <TableCell>{courses.find((c) => c.id === selectedCourse)?.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={studentGrades[student.studentId] ?? student.grade ?? ""}
                              onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                              className="w-20 mx-auto text-center"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Không có sinh viên trong lớp này
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {grades?.length > 0 && (
                  <div className="flex justify-end">
                    <Button onClick={saveGrades}>Lưu điểm</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Vui lòng chọn môn học và lớp để nhập điểm
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
