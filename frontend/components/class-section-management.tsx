"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { ClassSection, Course } from "@/types"
import { getCourseById } from "@/data/sample-data"
import { ClassSectionForm } from "@/components/class-section-form"
import classSectionService from "@/services/classSectionService"
import { toast } from "react-toastify"
import { set } from "react-hook-form"
import courseService from "@/services/courseService"
import { useTranslations } from "next-intl"

export function ClassSectionManagement() {
  const t = useTranslations("classes")
  const [classSections, setClassSections] = useState<ClassSection[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSection, setEditingSection] = useState<ClassSection | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setClassSections(await classSectionService.fetchClassSections())
        setCourses(await courseService.fetchCourses())
      } catch (error: any) {
        console.error("Error fetching class sections:", error)
        toast.error(error || t("errorLoadingData"))
      }
    }
    fetchData()
  },[])

  // Filter class sections based on search term
  const filteredSections = classSections.filter(
    (section) =>
      section.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseById(section.courseId, courses)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add new class section
  const addClassSection = async (section: Omit<ClassSection, "id" | "createdAt" | "currentEnrollment">) => {
    // Check if class section code already exists
    if (classSections.some((s) => s.code === section.code)) {
      toast.error(t("codeUnique"))
      return
    }

    // Check if course exists and is active
    const course = getCourseById(section.courseId, courses)
    if (!course) {
      toast.error(t("classNotFound"))
      return
    }

    if (!course.isActive) {
      toast.error(t("courseInactive"))
      return
    }

    const newSection: ClassSection = {
      ...section,
      id: `section-${classSections.length + 1}`,
      currentEnrollment: 0,
      createdAt: new Date().toISOString(),
    }
    try{
      await classSectionService.addClassSection(newSection)
      setClassSections([...classSections, newSection])
      toast.success(t("addSuccess"))
      setIsFormOpen(false)
    } catch(error: any) {
      console.error("Error adding class section:", error)
      toast.error(error || t("addError"))
    }
  }

  // Update class section
  const updateClassSection = async (updatedSection: ClassSection) => {
    try{
      const data = await classSectionService.updateClassSection(updatedSection)
      setClassSections(data.classSections)
      setEditingSection(null)
      setIsFormOpen(false)
      toast.success(t("updateSuccess"))
    } catch(error: any) {
      console.error("Error updating class section:", error)
      toast.error(error || t("updateError"))
    }
  }

  // Delete class section
  const deleteClassSection = async (id: string) => {
    const sectionToDelete = classSections.find((s) => s.id === id)
    if (!sectionToDelete) return

    // Check if class section has enrollments
    if (sectionToDelete.currentEnrollment > 0) {
      toast.error(t("cannotDeleteWithEnrollments"))
      return
    }

    try{
      const data = await classSectionService.deleteClassSection(id)
      setClassSections(data.classSections)
      toast.success(t("deleteSuccess"))
    } catch (error: any) {
      console.error("Error deleting class section:", error)
      toast.error(error || t("deleteError"))
    }
  }

  // Handle edit button click
  const handleEdit = (section: ClassSection) => {
    setEditingSection(section)
    setIsFormOpen(true)
  }

  // Handle add button click
  const handleAdd = () => {
    setEditingSection(null)
    setIsFormOpen(true)
  }

  // Get course name by ID
  const getCourseName = (courseId: string): string => {
    const course = getCourseById(courseId, courses)
    return course ? course.name : t("unknownCourse")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("title")}</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("addClass")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? t("updateClass") : t("addClass")}
              </DialogTitle>
            </DialogHeader>
            <ClassSectionForm
              classSection={editingSection}
              onSubmit={editingSection ? updateClassSection : addClassSection}
              courses={courses.filter((course) => course.isActive)}
              existingClassSections={classSections}
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
                <TableHead>{t("classCode")}</TableHead>
                <TableHead>{t("course")}</TableHead>
                <TableHead>{t("semester")}</TableHead>
                <TableHead>{t("instructor")}</TableHead>
                <TableHead>{t("schedule")}</TableHead>
                <TableHead>{t("capacity")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <TableRow key={section.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{section.code}</TableCell>
                    <TableCell>{getCourseName(section.courseId)}</TableCell>
                    <TableCell>
                      {section.semester === "1" ? t("semesterI") : section.semester === "2" ? t("semesterII") : t("semesterSummer")} - {section.academicYear}
                    </TableCell>
                    <TableCell>{section.instructor}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{section.schedule}</span>
                        <span className="text-xs text-gray-500">{t("classroom")}: {section.classroom}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {section.currentEnrollment}/{section.maxCapacity}
                        </span>
                        {section.currentEnrollment === section.maxCapacity && (
                          <Badge className="ml-2 bg-red-500">{t("full")}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(section)}
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteClassSection(section.id)}
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          disabled={section.currentEnrollment > 0}
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
                    {t("noData")}
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