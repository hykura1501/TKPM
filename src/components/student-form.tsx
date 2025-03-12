"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Student } from "@/app/page"

// Define validation schema
const studentSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  dateOfBirth: z.string().refine(
    (date) => {
      const today = new Date()
      const dob = new Date(date)
      const age = today.getFullYear() - dob.getFullYear()
      return age >= 16 && age <= 100
    },
    { message: "Tuổi phải từ 16 đến 100" },
  ),
  gender: z.enum(["Nam", "Nữ", "Khác"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  faculty: z.enum(["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"], {
    required_error: "Vui lòng chọn khoa",
  }),
  course: z.string().min(1, { message: "Vui lòng nhập khóa học" }),
  program: z.string().min(1, { message: "Vui lòng nhập chương trình học" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0 hoặc +84)",
  }),
  status: z.enum(["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"], {
    required_error: "Vui lòng chọn tình trạng",
  }),
})

type StudentFormProps = {
  student: Student | null
  onSubmit: (data: any) => void
}

export function StudentForm({ student, onSubmit }: StudentFormProps) {
  // Initialize form with default values or existing student data
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? {
          fullName: student.fullName,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          faculty: student.faculty,
          course: student.course,
          program: student.program,
          address: student.address,
          email: student.email,
          phone: student.phone,
          status: student.status,
        }
      : {
          fullName: "",
          dateOfBirth: "",
          gender: "Nam",
          faculty: "Khoa Luật",
          course: "",
          program: "",
          address: "",
          email: "",
          phone: "",
          status: "Đang học",
        },
  })

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof studentSchema>) => {
    if (student) {
      // If editing, preserve the ID
      onSubmit({ ...values, mssv: student.mssv })
    } else {
      // If adding new student
      onSubmit(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Nam" />
                      </FormControl>
                      <FormLabel className="font-normal">Nam</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Nữ" />
                      </FormControl>
                      <FormLabel className="font-normal">Nữ</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Khác" />
                      </FormControl>
                      <FormLabel className="font-normal">Khác</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khoa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Khoa Luật">Khoa Luật</SelectItem>
                    <SelectItem value="Khoa Tiếng Anh thương mại">Khoa Tiếng Anh thương mại</SelectItem>
                    <SelectItem value="Khoa Tiếng Nhật">Khoa Tiếng Nhật</SelectItem>
                    <SelectItem value="Khoa Tiếng Pháp">Khoa Tiếng Pháp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khóa</FormLabel>
                <FormControl>
                  <Input placeholder="2020" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chương trình</FormLabel>
                <FormControl>
                  <Input placeholder="Cử nhân" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0901234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tình trạng</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Đang học">Đang học</SelectItem>
                    <SelectItem value="Đã tốt nghiệp">Đã tốt nghiệp</SelectItem>
                    <SelectItem value="Đã thôi học">Đã thôi học</SelectItem>
                    <SelectItem value="Tạm dừng học">Tạm dừng học</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Đường ABC, Quận 1, TP.HCM" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Hủy bỏ
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {student ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

