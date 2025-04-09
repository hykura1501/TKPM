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
import type { Course, Department } from "@/types"

type CourseFormProps = {
  course: Course | null
  onSubmit: (data: any) => void
  departments: Department[]
  existingCourses: Course[]
}

export function CourseForm({ course, onSubmit, departments, existingCourses }: CourseFormProps) {
  // Define schema for course
  const courseSchema = z.object({
    code: z
      .string()
      .min(3, { message: "Mã khóa học phải có ít nhất 3 ký tự" })
      .refine(
        (code) => {
          // If editing, allow the same code
          if (course && code === course.code) return true
          // Otherwise, check if code is unique
          return !existingCourses.some((c) => c.code === code)
        },
        { message: "Mã khóa học đã tồn tại" },
      ),
    name: z.string().min(3, { message: "Tên khóa học phải có ít nhất 3 ký tự" }),
    credits: z
      .number()
      .min(2, { message: "Số tín chỉ phải lớn hơn hoặc bằng 2" })
      .max(10, { message: "Số tín chỉ không được vượt quá 10" }),
    department: z.string({ required_error: "Vui lòng chọn khoa phụ trách" }),
    description: z.string().min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
    prerequisites: z.array(z.string()).default([]),
  })

  // Initialize form with default values or existing course data
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          code: course.code,
          name: course.name,
          credits: course.credits,
          department: course.department,
          description: course.description,
          prerequisites: course.prerequisites,
        }
      : {
          code: "",
          name: "",
          credits: 3,
          department: departments[0]?.id || "",
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
  const handleSubmit = (values: z.infer<typeof courseSchema>) => {
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
                <FormLabel>Mã khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="CNTT001" {...field} disabled={!!course} />
                </FormControl>
                <FormDescription>Mã khóa học phải là duy nhất và không thể thay đổi sau khi tạo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập môn Lập trình" {...field} />
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
                <FormLabel>Số tín chỉ</FormLabel>
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
                    Không thể thay đổi số tín chỉ vì khóa học này đã có sinh viên đăng ký.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khoa phụ trách</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
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
                <FormLabel>Môn tiên quyết</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={availablePrerequisites}
                    onChange={field.onChange}
                    placeholder="Chọn các môn tiên quyết"
                  />
                </FormControl>
                <FormDescription>
                  Chọn các khóa học mà sinh viên phải hoàn thành trước khi đăng ký khóa học này.
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
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả chi tiết về khóa học..." className="min-h-[120px]" {...field} />
                </FormControl>
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
            {course ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
