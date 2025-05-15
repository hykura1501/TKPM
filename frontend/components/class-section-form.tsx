"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClassSection, Course } from "@/types"
import { useTranslations } from "next-intl"

type ClassSectionFormProps = {
  classSection: ClassSection | null
  onSubmit: (data: any) => void
  courses: Course[]
  existingClassSections: ClassSection[]
}

export function ClassSectionForm({ classSection, onSubmit, courses, existingClassSections }: ClassSectionFormProps) {
  const t = useTranslations("classes")
  const tCommon = useTranslations("common")

  // Define schema for class section
  const classSectionSchema = z.object({
    code: z
      .string()
      .min(3, { message: t("codeMinLength") })
      .refine(
        (code) => {
          // If editing, allow the same code
          if (classSection && code === classSection.code) return true
          // Otherwise, check if code is unique
          return !existingClassSections.some((c) => c.code === code)
        },
        { message: t("codeUnique") },
      ),
    courseId: z.string({ required_error: t("selectCourse") }),
    academicYear: z.string().min(4, { message: t("academicYearRequired") }),
    semester: z.string({ required_error: t("selectSemester") }),
    instructor: z.string().min(3, { message: t("instructorMinLength") }),
    maxCapacity: z
      .number()
      .min(1, { message: t("capacityMin") })
      .max(100, { message: t("capacityMax") }),
    schedule: z.string().min(3, { message: t("scheduleRequired") }),
    classroom: z.string().min(1, { message: t("classroomRequired") }),
  })

  // Initialize form with default values or existing class section data
  const form = useForm<z.infer<typeof classSectionSchema>>({
    resolver: zodResolver(classSectionSchema),
    defaultValues: classSection
      ? {
          code: classSection.code,
          courseId: classSection.courseId,
          academicYear: classSection.academicYear,
          semester: classSection.semester,
          instructor: classSection.instructor,
          maxCapacity: classSection.maxCapacity,
          schedule: classSection.schedule,
          classroom: classSection.classroom,
        }
      : {
          code: "",
          courseId: courses[0]?.id || "",
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          semester: "1",
          instructor: "",
          maxCapacity: 40,
          schedule: "",
          classroom: "",
        },
  })

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof classSectionSchema>) => {
    if (classSection) {
      // If editing, preserve the ID and other fields
      onSubmit({
        ...classSection,
        ...values,
      })
    } else {
      // If adding new class section
      onSubmit(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("classCode")}</FormLabel>
                <FormControl>
                  <Input placeholder="CNTT001-01" {...field} disabled={!!classSection} />
                </FormControl>
                <FormDescription>{t("codeUnique")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("course")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!classSection}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCourse")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {classSection && <FormDescription>{t("cannotChangeCourse")}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("academicYear")}</FormLabel>
                <FormControl>
                  <Input placeholder="2023-2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("semester")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSemester")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">{t("semesterI")}</SelectItem>
                    <SelectItem value="2">{t("semesterII")}</SelectItem>
                    <SelectItem value="Summer">{t("semesterSummer")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("instructor")}</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("capacity")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                    disabled={classSection && classSection.currentEnrollment > 0}
                  />
                </FormControl>
                {classSection && classSection.currentEnrollment > 0 && (
                  <FormDescription>{t("cannotChangeCapacity")}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("schedule")}</FormLabel>
                <FormControl>
                  <Input placeholder="Thứ 2, 7:30 - 9:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("classroom")}</FormLabel>
                <FormControl>
                  <Input placeholder="A101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {classSection ? tCommon("update") : tCommon("add")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
