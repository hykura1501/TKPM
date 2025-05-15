"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import type { Course } from "@/types"
import type { Faculty } from "@/types/student"
import { useTranslations } from "next-intl"

type CourseFormProps = {
  course: Course | null
  onSubmit: (data: any) => void
  faculties: Faculty[]
  existingCourses: Course[]
}

// Define the form schema type
type CourseFormValues = {
  code: string
  name: string
  credits: number
  faculty: string
  description: string
  prerequisites: string[]
}

export function CourseForm({ course, onSubmit, faculties, existingCourses }: CourseFormProps) {
  const t = useTranslations("courses")
  const tCommon = useTranslations("common")

  // Define schema for course
  const courseSchema = z.object({
    code: z
      .string()
      .min(3, { message: t("codeMinLength") })
      .refine(
        (code) => {
          // If editing, allow the same code
          if (course && code === course.code) return true
          // Otherwise, check if code is unique
          return !existingCourses.some((c) => c.code === code)
        },
        { message: t("codeUnique") },
      ),
    name: z.string().min(3, { message: t("nameMinLength") }),
    credits: z
      .number()
      .min(2, { message: t("minCredits") })
      .max(10, { message: t("maxCredits") }),
    faculty: z.string({ required_error: t("selectDepartment") }),
    description: z.string().min(10, { message: t("minDescription") }),
    prerequisites: z.array(z.string()).default([]),
  })

  // Initialize form with default values or existing course data
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          code: course.code,
          name: course.name,
          credits: course.credits,
          faculty: course.faculty,
          description: course.description,
          prerequisites: course.prerequisites,
        }
      : {
          code: "",
          name: "",
          credits: 3,
          faculty: faculties[0]?.id || "",
          description: "",
          prerequisites: [],
        },
  })

  // Get available prerequisite courses (excluding the current course)
  const availablePrerequisites = existingCourses
    .filter((c) => c.id !== course?.id)
    .map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }))

  // Handle form submission
  const handleSubmit = (values: CourseFormValues) => {
    if (course) {
      // If editing, preserve the ID and other fields
      onSubmit({
        ...course,
        ...values,
      })
    } else {
      // If adding new course
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
                <FormLabel>{t("courseCode")}</FormLabel>
                <FormControl>
                  <Input placeholder="CNTT001" {...field} disabled={!!course} />
                </FormControl>
                <FormDescription>{t("codeUnique")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("courseName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("credits")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2}
                    max={10}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                    disabled={course && course.prerequisites.length > 0}
                  />
                </FormControl>
                {course && course.prerequisites.length > 0 && (
                  <FormDescription>
                    {t("cannotChangeCredits")}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("department")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectDepartment")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
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
            name="prerequisites"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("prerequisites")}</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={availablePrerequisites}
                    onChange={field.onChange}
                    placeholder={t("selectPrerequisites")}
                  />
                </FormControl>
                <FormDescription>
                  {t("prerequisitesDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("descriptionPlaceholder")} className="min-h-[120px]" {...field} />
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
            {course ? tCommon("update") : tCommon("add")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
