"use client"

import { use, useState, useEffect } from "react";
import { PlusCircle, Search, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { ClassSection, Course, Registration } from "@/types"
import { Student } from "@/types/student"
import { toast } from "react-toastify";
import {
  getCourseById,
  getStudentById,
  getClassSectionById,
} from "@/data/sample-data"
import { RegistrationForm } from "@/components/registration-form"
import registrationService from "@/services/registrationService" 
import studentService from "@/services/studentService";
import classSectionService from "@/services/classSectionService";
import { set } from "react-hook-form";
import courseService from "@/services/courseService";
import { useTranslations } from "next-intl"
import { PageLoader } from "./ui/page-loader";

export function StudentRegistration() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [classSections, setClassSections] = useState<ClassSection[]>([])
  const t = useTranslations("registration")
  const common = useTranslations("common")
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setCourses(await courseService.fetchCourses())
        setClassSections(await classSectionService.fetchClassSections())
        setStudents(await studentService.fetchStudents())
        setRegistrations(await registrationService.fetchRegistrations())
        setIsLoading(false)
      } catch (error: any) {
        toast.error(error.message || t("errorLoadingData"))
        console.error("Error loading data:", error)
      }
    }
    fetchData()
  }, [])

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter((registration) => {
    const student = getStudentById(registration.studentId, students)
    const classSection = getClassSectionById(registration.classSectionId, classSections)
    const course = classSection ? getCourseById(classSection.courseId, courses) : null

    const searchValue = searchTerm.toLowerCase().trim()
    if (!searchValue) return true
    return (
      student?.fullName.toLowerCase().includes(searchValue) ||
      student?.mssv.toLowerCase().includes(searchValue) ||
      classSection?.code.toLowerCase().includes(searchValue) ||
      course?.name.toLowerCase().includes(searchValue)
    )
  })

  // Add new registration
  const addRegistration = async (data: { mssv: string; classSectionId: string }) => {
    try {
      // Validate student
      const student = getStudentById(data.mssv, students)
      if (!student) {
        toast.error(t("studentNotFound"))
        return
      }

      // Validate class
      const classSection = getClassSectionById(data.classSectionId, classSections)
      if (!classSection) {
        toast.error(t("classNotFound"))
        return
      }

      // Check if class is full
      if (classSection.currentEnrollment >= classSection.maxCapacity) {
        toast.error(t("classFull"))
        return
      }

      // Check if student is already registered
      const existingRegistration = registrations.find(
        (reg) => reg.studentId === data.mssv && reg.classSectionId === data.classSectionId && reg.status === "active"
      )
      if (existingRegistration) {
        toast.error(t("alreadyRegistered"))
        return
      }

      // Check prerequisites
      const course = getCourseById(classSection.courseId, courses)
      if (course && course.prerequisites.length > 0) {
        // Get all courses the student has completed
        const completedCourses = registrations
          .filter((r) => r.studentId === data.mssv && r.status === "active" && r.grade && r.grade >= 5)
          .map((r) => {
            const section = getClassSectionById(r.classSectionId, classSections)
            if (!section) return null
            const course = getCourseById(section.courseId, courses)
            return course?.code || null
          })
          .filter(Boolean) as string[]

        // Check if all prerequisites are met
        const missingPrerequisites = course.prerequisites.filter((prereq) => !completedCourses.includes(prereq))

        if (missingPrerequisites.length > 0) {
          toast.error(t("registrationError"))
          return
        }
      }

      // Register student
      try {
        const newRegistration: Registration = {
          id: `reg-${registrations.length + 1}`,
          studentId: data.mssv,
          classSectionId: data.classSectionId,
          status: "active",
          registeredAt: new Date().toISOString(),
        }

        const response = await registrationService.addRegistration(newRegistration)
        setRegistrations(response.registrations)
        
        // Update class section enrollment count
        const updatedClassSections = classSections.map((section) =>
          section.id === data.classSectionId ? { ...section, currentEnrollment: section.currentEnrollment + 1 } : section,
        )

        setIsFormOpen(false)
        toast.success(t("registrationSuccess"))
      } catch (error: any) {
        toast.error(t("registrationError"))
      }
    } catch (error) {
      toast.error(error.message || t("errorLoadingData"))
    }
  }

  // Cancel registration
  const cancelRegistration = async (id: string) => {
    try {
      const registrationToCancel = registrations.find((r) => r.id === id)
      if (!registrationToCancel) return

      // Check if registration is within 14 days
      const registeredAt = new Date(registrationToCancel.registeredAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff > 14) {
        toast.error(t("cannotCancelAfter14Days"))
        return
      }

      try {
        const response = await registrationService.cancelRegistration(id)
        setRegistrations(response.registrations)

        toast.success(t("cancelSuccess"))
      } catch (error: any) {
        toast.error(t("cancelError"))
      }
    } catch (error) {
      toast.error(error.message || t("errorLoadingData"))
    }
  }

  // Handle add button click
  const handleAdd = async() => {
    setIsFormOpen(true)
    setClassSections(await classSectionService.fetchClassSections())
  }

  // Get student fullName by ID
  const getStudentName = (mssv: string): string => {
    const student = getStudentById(mssv, students)
    return student ? student.fullName : "Unknown Student"
  }

  // Get class section and course info
  const getClassInfo = (classSectionId: string): { sectionCode: string; courseName: string } => {
    const section = getClassSectionById(classSectionId, classSections)
    if (!section) return { sectionCode: "Unknown", courseName: "Unknown" }

    const course = getCourseById(section.courseId, courses)
    return {
      sectionCode: section.code,
      courseName: course ? course.name : "Unknown Course",
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("titleForStudent")}</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("addRegistration")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("titleForStudent")}</DialogTitle>
            </DialogHeader>
            <RegistrationForm
              onSubmit={addRegistration}
              students={students}
              classSections={classSections.filter((section) => section.currentEnrollment < section.maxCapacity)}
              courses={classSections.map((section) => getCourseById(section.courseId, courses)).filter(Boolean) as any}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
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
                <TableHead>{t("student")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("class")}</TableHead>
                <TableHead>{t("course")}</TableHead>
                <TableHead>{t("registrationDate")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{common("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration) => {
                  const student = getStudentById(registration.studentId, students)
                  const classInfo = getClassInfo(registration.classSectionId)

                  return (
                    <TableRow key={registration.id} className="hover:bg-gray-50">
                      <TableCell>{student?.mssv}</TableCell>
                      <TableCell>{getStudentName(registration.studentId)}</TableCell>
                      <TableCell>{classInfo.sectionCode}</TableCell>
                      <TableCell>{classInfo.courseName}</TableCell>
                      <TableCell>{new Date(registration.registeredAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        {registration.status === "active" ? (
                          <Badge className="bg-green-500 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {t("active")}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {t("cancelled")}
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
                            {t("cancelRegistration")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
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

