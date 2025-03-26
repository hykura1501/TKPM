"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Student, Faculty, StudentStatus, Program } from "@/types/student";
import { toast } from "react-toastify";

// Định nghĩa schema cho địa chỉ
const addressSchema = z
  .object({
    streetAddress: z
      .string()
      .min(1, { message: "Vui lòng nhập số nhà, tên đường" }),
    ward: z.string().min(1, { message: "Vui lòng nhập phường/xã" }),
    district: z.string().min(1, { message: "Vui lòng nhập quận/huyện" }),
    province: z.string().min(1, { message: "Vui lòng nhập tỉnh/thành phố" }),
    country: z.string().min(1, { message: "Vui lòng nhập quốc gia" }),
  })
  .optional();

// Định nghĩa schema cho giấy tờ tùy thân
const identityDocumentSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("CMND"),
      number: z.string().min(9, { message: "Số CMND phải có ít nhất 9 số" }),
      issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
      issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
      expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
    }),
    z.object({
      type: z.literal("CCCD"),
      number: z.string().min(12, { message: "Số CCCD phải có ít nhất 12 số" }),
      issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
      issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
      expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
      hasChip: z.boolean(),
    }),
    z.object({
      type: z.literal("Passport"),
      number: z
        .string()
        .min(8, { message: "Số hộ chiếu phải có ít nhất 8 ký tự" }),
      issueDate: z.string().min(1, { message: "Vui lòng nhập ngày cấp" }),
      issuePlace: z.string().min(1, { message: "Vui lòng nhập nơi cấp" }),
      expiryDate: z.string().min(1, { message: "Vui lòng nhập ngày hết hạn" }),
      issuingCountry: z
        .string()
        .min(1, { message: "Vui lòng nhập quốc gia cấp" }),
      notes: z.string().optional(),
    }),
  ])
  .optional();
const allowedDomains = ["student.university.edu.vn", "hcmus.edu.vn"]; // Danh sách tên miền được phép (có thể cấu hình động)

// Định nghĩa schema cho sinh viên
const studentSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  dateOfBirth: z.string().refine(
    (date) => {
      const today = new Date();
      const dob = new Date(date);
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 16 && age <= 100;
    },
    { message: "Tuổi phải từ 16 đến 100" }
  ),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  faculty: z.string({
    required_error: "Vui lòng chọn khoa",
  }),
  course: z.string().min(1, { message: "Vui lòng nhập khóa học" }),
  program: z.string({
    required_error: "Vui lòng chọn chương trình học",
  }),
  permanentAddress: addressSchema,
  temporaryAddress: addressSchema,
  mailingAddress: addressSchema,
  identityDocument: identityDocumentSchema,
  nationality: z.string().min(1, { message: "Vui lòng nhập quốc tịch" }),
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return allowedDomains.includes(domain);
      },
      {
        message:
          "Email phải thuộc một trong các tên miền: " +
          allowedDomains.join(", "),
      }
    ),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message:
      "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0 hoặc +84)",
  }),
  status: z.string({
    required_error: "Vui lòng chọn tình trạng",
  }),
});

type StudentFormProps = {
  student?: Student;
  onSubmit: (data: Student) => void;
  faculties: Faculty[];
  statuses: StudentStatus[];
  programs: Program[];
  cancelForm: () => void;
};

export function StudentForm({
  student,
  onSubmit,
  faculties,
  statuses,
  programs,
  cancelForm,
}: StudentFormProps) {
  const [idType, setIdType] = useState<"CMND" | "CCCD" | "Passport">(
    student?.identityDocument?.type || "CMND"
  );

  const [useTemporaryAddress, setUseTemporaryAddress] = useState(
    !!student?.temporaryAddress
  );

  const [useSameMailingAddress, setUseSameMailingAddress] = useState(
    !student?.mailingAddress ||
      JSON.stringify(student.mailingAddress) ===
        JSON.stringify(student.permanentAddress)
  );

  // Lọc chương trình theo khoa đã chọn
  const [selectedFaculty, setSelectedFaculty] = useState(
    student?.faculty || faculties[0]?.id
  );
  const filteredPrograms = programs.filter(
    (p) => p.faculty === selectedFaculty
  );

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
          permanentAddress: student.permanentAddress,
          temporaryAddress: student.temporaryAddress,
          mailingAddress: student.mailingAddress,
          identityDocument: student.identityDocument,
          nationality: student.nationality || "Việt Nam",
          email: student.email,
          phone: student.phone,
          status: student.status,
        }
      : {
          fullName: "",
          dateOfBirth: "",
          gender: "male",
          faculty: faculties[0]?.id || "",
          course: "",
          program: "",
          nationality: "Việt Nam",
          email: "",
          phone: "",
          status: statuses[0]?.id || "",
        },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof studentSchema>) => {
    // Nếu không sử dụng địa chỉ tạm trú, xóa giá trị
    if (!useTemporaryAddress) {
      values.temporaryAddress = undefined;
    }

    // Nếu sử dụng cùng địa chỉ nhận thư, sao chép từ địa chỉ thường trú
    if (useSameMailingAddress) {
      values.mailingAddress = values.permanentAddress;
    }

    if (student) {
      // If editing, preserve the ID and timestamps
      onSubmit({
        ...values,
        mssv: student.mssv,
        createdAt: student.createdAt,
        updatedAt: new Date().toISOString(), // Thêm `updatedAt`
      });
    } else {
      // If adding new student
      onSubmit({
        ...values,
        mssv: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Xử lý khi thay đổi khoa
  const handleFacultyChange = (value: string) => {
    setSelectedFaculty(value);
    form.setValue("faculty", value);

    // Reset program if it doesn't belong to the selected faculty
    const currentProgram = form.getValues("program");
    const programExists = programs.some(
      (p) => p.id === currentProgram && p.faculty === value
    );

    if (!programExists) {
      const firstValidProgram = programs.find((p) => p.faculty === value);
      form.setValue("program", firstValidProgram?.id || "");
    }
  };

  const statusTransitionRules: Record<string, string[]> = {
    "Đang học": ["Bảo lưu", "Đã tốt nghiệp", "Đã thôi học"],
    "Bảo lưu": ["Đang học", "Đã thôi học"],
    "Đã thôi học": [],
    "Đã tốt nghiệp": [],
  };
  const handleStatusChange = (currentStatus: string, newStatus: string) => {
    const status1 = statuses.find((s) => s.id === currentStatus)?.name;
    const status2 = statuses.find((s) => s.id === newStatus)?.name;
    // Kiểm tra nếu status1 hoặc status2 là undefined
    if (!status1 || !status2) {
      toast.error("Trạng thái không hợp lệ.");
      return false;
    }
    if (!statusTransitionRules[status1]?.includes(status2)) {
      toast.error(
        `Không thể chuyển từ trạng thái "${status1}" sang "${status2}"`
      );
      return false;
    }
    return true;
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 bg-white p-4 rounded-lg"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="address">Địa chỉ</TabsTrigger>
            <TabsTrigger value="identity">Giấy tờ tùy thân</TabsTrigger>
            <TabsTrigger value="academic">Thông tin học tập</TabsTrigger>
          </TabsList>

          {/* Thông tin cơ bản */}
          <TabsContent value="basic" className="space-y-4">
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Nam</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Nữ</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
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
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc tịch</FormLabel>
                    <FormControl>
                      <Input placeholder="Việt Nam" {...field} />
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
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
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
            </div>
          </TabsContent>

          {/* Địa chỉ */}
          <TabsContent value="address" className="space-y-6">
            {/* Địa chỉ thường trú */}
            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ thường trú</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="permanentAddress.streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số nhà, tên đường</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Đường ABC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phường/Xã</FormLabel>
                        <FormControl>
                          <Input placeholder="Phường 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quận/Huyện</FormLabel>
                        <FormControl>
                          <Input placeholder="Quận 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <FormControl>
                          <Input placeholder="TP. Hồ Chí Minh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quốc gia</FormLabel>
                        <FormControl>
                          <Input placeholder="Việt Nam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Địa chỉ tạm trú */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Địa chỉ tạm trú</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useTemporaryAddress"
                      checked={useTemporaryAddress}
                      onCheckedChange={(checked) =>
                        setUseTemporaryAddress(!!checked)
                      }
                    />
                    <label
                      htmlFor="useTemporaryAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Có địa chỉ tạm trú
                    </label>
                  </div>
                </div>
              </CardHeader>
              {useTemporaryAddress && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="temporaryAddress.streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số nhà, tên đường</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Đường ABC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temporaryAddress.ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường/Xã</FormLabel>
                          <FormControl>
                            <Input placeholder="Phường 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temporaryAddress.district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quận/Huyện</FormLabel>
                          <FormControl>
                            <Input placeholder="Quận 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temporaryAddress.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tỉnh/Thành phố</FormLabel>
                          <FormControl>
                            <Input placeholder="TP. Hồ Chí Minh" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temporaryAddress.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quốc gia</FormLabel>
                          <FormControl>
                            <Input placeholder="Việt Nam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Địa chỉ nhận thư */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Địa chỉ nhận thư</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useSameMailingAddress"
                      checked={useSameMailingAddress}
                      onCheckedChange={(checked) =>
                        setUseSameMailingAddress(!!checked)
                      }
                    />
                    <label
                      htmlFor="useSameMailingAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sử dụng địa chỉ thường trú
                    </label>
                  </div>
                </div>
              </CardHeader>
              {!useSameMailingAddress && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mailingAddress.streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số nhà, tên đường</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Đường ABC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingAddress.ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường/Xã</FormLabel>
                          <FormControl>
                            <Input placeholder="Phường 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingAddress.district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quận/Huyện</FormLabel>
                          <FormControl>
                            <Input placeholder="Quận 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingAddress.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tỉnh/Thành phố</FormLabel>
                          <FormControl>
                            <Input placeholder="TP. Hồ Chí Minh" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingAddress.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quốc gia</FormLabel>
                          <FormControl>
                            <Input placeholder="Việt Nam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Giấy tờ tùy thân */}
          <TabsContent value="identity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Giấy tờ tùy thân</CardTitle>
                <CardDescription>
                  Chọn một loại giấy tờ tùy thân
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={idType === "CMND" ? "default" : "outline"}
                    onClick={() => setIdType("CMND")}
                  >
                    CMND
                  </Button>
                  <Button
                    type="button"
                    variant={idType === "CCCD" ? "default" : "outline"}
                    onClick={() => setIdType("CCCD")}
                  >
                    CCCD
                  </Button>
                  <Button
                    type="button"
                    variant={idType === "Passport" ? "default" : "outline"}
                    onClick={() => setIdType("Passport")}
                  >
                    Hộ chiếu
                  </Button>
                </div>

                <input
                  type="hidden"
                  {...form.register("identityDocument.type")}
                  value={idType}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CMND Fields */}
                  {idType === "CMND" && (
                    <>
                      <FormField
                        control={form.control}
                        name="identityDocument.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số CMND</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày cấp</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issuePlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nơi cấp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="CA TP. Hồ Chí Minh"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* CCCD Fields */}
                  {idType === "CCCD" && (
                    <>
                      <FormField
                        control={form.control}
                        name="identityDocument.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số CCCD</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày cấp</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issuePlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nơi cấp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.hasChip"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Có gắn chip</FormLabel>
                              <FormDescription>
                                CCCD có gắn chip điện tử
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Passport Fields */}
                  {idType === "Passport" && (
                    <>
                      <FormField
                        control={form.control}
                        name="identityDocument.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số hộ chiếu</FormLabel>
                            <FormControl>
                              <Input placeholder="A12345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày cấp</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issuePlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nơi cấp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cục Quản lý Xuất nhập cảnh"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.issuingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quốc gia cấp</FormLabel>
                            <FormControl>
                              <Input placeholder="Việt Nam" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityDocument.notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ghi chú thêm (nếu có)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thông tin học tập */}
          <TabsContent value="academic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khoa</FormLabel>
                    <Select
                      onValueChange={(value) => handleFacultyChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khoa" />
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
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chương trình</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chương trình" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredPrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tình trạng</FormLabel>
                    <Select
                      onValueChange={(newStatus) => {
                        const currentStatus = student?.status || "";
                        if (handleStatusChange(currentStatus, newStatus)) {
                          field.onChange(newStatus);
                        }
                      }}
                      defaultValue={field.value || student?.status || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tình trạng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {student ? (
                          <>
                            <SelectItem
                              value={student?.status}
                              key={student?.status}
                            >
                              {
                                statuses.find((s) => s.id === student?.status)
                                  ?.name
                              }
                            </SelectItem>
                            {statusTransitionRules[
                              statuses.find((s) => s.id === student?.status)
                                ?.name || ""
                            ]?.map((validStatusName) => {
                              const validStatus = statuses.find(
                                (s) => s.name === validStatusName
                              );
                              if (!validStatus) return null; // Bỏ qua nếu không tìm thấy trạng thái hợp lệ
                              return (
                                <SelectItem
                                  key={validStatus.id}
                                  value={validStatus.id}
                                >
                                  {validStatus.name}
                                </SelectItem>
                              );
                            })}
                          </>
                        ) : (
                          statuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() =>{ form.reset(); cancelForm();}}>
            Hủy bỏ
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {student ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
