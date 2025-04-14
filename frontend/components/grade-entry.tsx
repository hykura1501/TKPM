"use client"

import type React from "react"
import { useEffect, useState } from "react"
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

export default function GradeEntry() {
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
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")

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

  const [studentGrades, setStudentGrades] = useState<{ [key: string]: string }>({})
  // Handle grade change for manual entry
  const handleGradeChange = (studentId: string, value: string) => {
    setStudentGrades({
      ...studentGrades,
      [studentId]: value,
    })
  }

  // Save grades for manual entry
  const saveGrades = async () => {
    // Validate grades
    const invalidGrades = Object.entries(studentGrades).filter(([_, value]) => {
      const score = Number.parseFloat(value)
      return isNaN(score) || score < 0 || score > 10
    })

    if (invalidGrades.length > 0) {
      alert("Điểm phải là số từ 0 đến 10")
      return
    }
    console.log("studentGrades", studentGrades);
    
    await registrationService.saveGradesByClassId(selectedClass, studentGrades)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập Điểm</CardTitle>
        {/* <CardDescription>Nhập điểm từ file Excel hoặc nhập thủ công</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course">Môn học</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
                <Select value={selectedClass} onValueChange={setSelectedClass}>
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
                          <TableCell>{classes?.find((cls) => cls.id === selectedClass)?.code}</TableCell>
                          <TableCell>{courses.find((c) => c.id === selectedCourse)?.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={student.grade || studentGrades[student.studentId]}
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
              <div className="text-center py-8 text-muted-foreground">Vui lòng chọn môn học và lớp để nhập điểm</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
