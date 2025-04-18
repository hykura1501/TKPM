"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClassSection, Course } from "@/types"
import { Student } from "@/types/student"
import { getCourseById } from "@/data/sample-data"

type RegistrationFormProps = {
  onSubmit: (data: { mssv: string; classSectionId: string }) => void
  students: Student[]
  classSections: ClassSection[]
  courses: Course[]
}

export function RegistrationForm({ onSubmit, students, classSections, courses }: RegistrationFormProps) {
  // Define schema for registration
  const registrationSchema = z.object({
    mssv: z.string({ required_error: "Vui lòng chọn sinh viên" }),
    classSectionId: z.string({ required_error: "Vui lòng chọn lớp học" }),
  })

  // Initialize form
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      mssv: "",
      classSectionId: "",
    },
  })

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof registrationSchema>) => {
    onSubmit(values)
  }

  // Get course name by ID
  const getCourseName = (courseId: string): string => {
    const course = getCourseById(courseId, courses)
    return course ? course.name : "Unknown Course"
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="mssv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinh viên</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn sinh viên" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.mssv} value={student.mssv}>
                        {student.mssv} - {student.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classSectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lớp học</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classSections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.code} - {getCourseName(section.courseId)} ({section.currentEnrollment}/
                        {section.maxCapacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Chỉ hiển thị các lớp học còn chỗ trống.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Hủy bỏ
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Đăng ký
          </Button>
        </div>
      </form>
    </Form>
  )
}

