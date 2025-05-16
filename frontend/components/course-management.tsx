"use client";

import { use, useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Course, Translation } from "@/types/index";
import { classSections, getDepartmentName } from "@/data/sample-data";
import { CourseForm } from "@/components/course-form";
import { toast } from "react-toastify";
import courseService from "@/services/courseService";
import facultyService from "@/services/facultyService";
import { Faculty } from "@/types/student";
import { Global } from "recharts";
import { TranslationManager } from "./translation-manager";
import { useLocale, useTranslations } from "next-intl";

const mockInitialTranslations = {
  en: {
    courseName: "Introduction to Computer Science",
    description:
      "This course provides an introduction to the fundamentals of computer science.",
  },
  vi: {
    courseName: "Nhập môn Khoa học Máy tính",
    description: "Khóa học này cung cấp kiến thức cơ bản về khoa học máy tính.",
  },
  ji: {
    courseName: "コンピュータサイエンス入門",
    description: "このコースでは、コンピュータサイエンスの基礎を紹介します。",
  },
};

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const [translations, setTranslations] = useState<Translation | null>(
    mockInitialTranslations
  );
  const t = useTranslations("courses");
  const locale = useLocale();
  // Define the translation fields
  const translationFields = [
    {
      key: "courseName",
      label: t("courseName"),
      type: "input" as const,
      required: true,
    },
    {
      key: "description",
      label: t("description"),
      type: "textarea" as const,
      required: false,
    },
  ];

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new course
  const addCourse = async (
    course: Omit<Course, "id" | "createdAt" | "updatedAt" | "isActive">
  ) => {
    // Check if course code already exists
    if (courses.some((c) => c.code === course.code)) {
      toast.error("Mã khóa học đã tồn tại trong hệ thống.");
      return;
    }

    // Validate prerequisites
    for (const prereqCode of course.prerequisites) {
      if (!courses.some((c) => c.code === prereqCode)) {
        toast.error(
          `Môn tiên quyết ${prereqCode} không tồn tại trong hệ thống.`
        );
        return;
      }
    }

    const now = new Date().toISOString();
    const newCourse: Course = {
      ...course,
      id: `course-${courses.length + 1}`,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const data = await courseService.addCourse(newCourse);
      setCourses(data.courses);
      setIsFormOpen(false);

      toast.success(`Khóa học ${newCourse.name} đã được thêm thành công.`);
    } catch (error: any) {
      toast.error(error || "Đã xảy ra lỗi khi thêm khóa học.");
    }
  };

  // Update course
  const updateCourse = async (updatedCourse: Course) => {
    // setCourses(
    //   courses.map((course) =>
    //     course.id === updatedCourse.id ? { ...updatedCourse, updatedAt: new Date().toISOString() } : course,
    //   ),
    // )
    try {
      const data = await courseService.updateCourse(updatedCourse);
      setCourses(data.courses);
      setEditingCourse(null);
      setIsFormOpen(false);

      toast.success(
        `Khóa học ${updatedCourse.name} đã được cập nhật thành công.`
      );
    } catch (error: any) {
      toast.error(error || "Đã xảy ra lỗi khi cập nhật khóa học.");
    }
  };

  // Delete course
  const deleteCourse = async (id: string) => {
    const courseToDelete = courses.find((c) => c.id === id);
    if (!courseToDelete) return;

    // Check if course can be deleted (within 30 minutes of creation)
    const createdAt = new Date(courseToDelete.createdAt);
    const now = new Date();
    const timeDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60); // in minutes

    if (timeDiff > 30) {
      toast.error("Khóa học đã được tạo hơn 30 phút trước, không thể xóa.");
      return;
    }

    try {
      const data = await courseService.deleteCourse(id);

      // Deactivate instead of delete
      setCourses(data.courses);
      toast.success(data.message || "Khóa học đã bị vô hiệu hóa hoặc bị xóa.");
    } catch (error: any) {
      toast.error(error || "Đã xảy ra lỗi khi xóa khóa học.");
    }
  };

  // Handle edit button click
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  // Handle add button click
  const handleAdd = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };
  async function handleUpdateTranslations(
    updatedTranslations: Translation | null
  ) {
    if (!editingCourse) return;

    try {
      const data = await courseService.updateTranslationCourse(
        editingCourse.id,
        updatedTranslations
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === editingCourse.id
            ? {
                ...course,
                name: updatedTranslations?.[locale]?.courseName || course.name, // Cập nhật `name`
                description:
                  updatedTranslations?.[locale]?.description ||
                  course.description, // Cập nhật `description`
              }
            : course
        )
      );
      setEditingCourse(null);
      setTranslations(updatedTranslations);
      //Cập nhật trong danh sách khóa học

      setTranslationOpen(false);
      toast.success("Cập nhật thông tin dịch thuật thành công.");
    } catch (error: any) {
      toast.error(error || "Đã xảy ra lỗi khi cập nhật thông tin dịch thuật.");
    }
  }
  async function handleTranslateButtonClick(course: Course) {
    // Fetch translations for the selected course
    try {
      const data = await courseService.getTranslationCourseById(course.id);
      setTranslations(data);
      setEditingCourse(course);
    } catch (error: any) {
      toast.error(error || "Đã xảy ra lỗi khi tải thông tin dịch thuật.");
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setCourses(await courseService.fetchCourses());
        setFaculties(await facultyService.fetchFaculties());
      } catch (error: any) {
        toast.error(error || "Đã xảy ra lỗi khi tải danh sách khóa học.");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (translations && editingCourse) {
      setTranslationOpen(true);
    }
  }, [translations]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Khóa học</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm Khóa học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse
                  ? "Cập nhật Thông tin Khóa học"
                  : "Thêm Khóa học Mới"}
              </DialogTitle>
            </DialogHeader>
            <CourseForm
              course={editingCourse}
              onSubmit={editingCourse ? updateCourse : addCourse}
              faculties={faculties}
              existingCourses={courses}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
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
                <TableHead>Mã khóa học</TableHead>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Số tín chỉ</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead>Môn tiên quyết</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      {getDepartmentName(course.faculty, faculties)}
                    </TableCell>
                    <TableCell>
                      {course.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq) => (
                            <Badge key={prereq} variant="outline">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "Không có"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          course.isActive ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {course.isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={async () => {
                            // Handle edit translation
                            await handleTranslateButtonClick(course);
                          }}
                          className="h-8 w-8 text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(course)}
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteCourse(course.id)}
                          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    Không tìm thấy khóa học nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <TranslationManager
        open={translationOpen}
        onOpenChange={setTranslationOpen}
        entityType="course"
        entityId={""}
        fields={translationFields}
        initialTranslations={translations}
        onSave={handleUpdateTranslations}
      />
    </Card>
  );
}
