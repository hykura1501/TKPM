"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  Download,
  Settings,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentForm } from "@/components/student-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportExportDialog } from "@/components/import-export-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { LogsDialog } from "@/components/logs-dialog";
import type {
  Student,
  Faculty,
  StudentStatus,
  Program,
  LogEntry,
  SystemConfig,
} from "@/types/student";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { js2xml } from "xml-js";
import { z } from "zod";
import { ToastContainer } from "react-toastify";

import StudentService from "@/services/studentService";
import FacultyService from "@/services/facultyService";
import ProgramService from "@/services/programService";
import LogService from "@/services/logService";
import StatusService from "@/services/statusService";
import { toast } from "react-toastify";
import { ConfigDialog } from "@/components/config-dialog";
import settingService from "@/services/settingSevices";


export default function Home() {
  // State for students and related data
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {} as Record<string, number>,
    byFaculty: {} as Record<string, number>,
  });
  // const [isLoading, setIsLoading] = useState(true)
  async function pushLop(log: LogEntry) {
    try {
      const data = await LogService.addLog(log);
      setLogs((prev) => [...prev, data.log]);
    } catch (error) {
      console.error("Failed to add student", error);
    }
  }
  const [statusRules, setStatusRules] = useState<Record<string, string[]>>  ({}); 
  // Load initial data
  useEffect(() => {
    async function loadData() {
      const studentsData = await StudentService.fetchStudents();
      const facultiesData = await FacultyService.fetchFaculties();
      const statusesData = await StatusService.fetchStatuses();
      const programsData = await ProgramService.fetchPrograms();
      const settings = await settingService.fetchSettings();
      const statusTransitionRules = await settingService.getFormatRules();

      setStudents(studentsData);
      setFaculties(facultiesData);
      setStatuses(statusesData);
      setPrograms(programsData);
      setSystemConfig(settings);
      setStatusRules(statusTransitionRules);
    }

    loadData();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    const statusCounts = {} as Record<string, number>;
    const facultyCounts = {} as Record<string, number>;

    students.forEach((student) => {
      // Count by status
      if (statusCounts[student.status]) {
        statusCounts[student.status]++;
      } else {
        statusCounts[student.status] = 1;
      }

      // Count by faculty
      if (facultyCounts[student.faculty]) {
        facultyCounts[student.faculty]++;
      } else {
        facultyCounts[student.faculty] = 1;
      }
    });

    setStats({
      total: students.length,
      byStatus: statusCounts,
      byFaculty: facultyCounts,
    });
  }, [students]);

  // Filter students based on search term and selected faculty
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mssv.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty =
      selectedFaculty === "all" || student.faculty === selectedFaculty;

    return matchesSearch && matchesFaculty;
  });

  // Add new student
  const addStudent = async (
    student: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newStudent = await StudentService.addStudent(student);
      setStudents([...students, newStudent]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to add student", error);
    }
  };

  // Update student
  const updateStudent = async (updatedStudent: Student) => {
    try {
      await StudentService.updateStudent(updatedStudent);
      setStudents(
        students.map((student) =>
          student.mssv === updatedStudent.mssv ? updatedStudent : student
        )
      );
      setEditingStudent(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to update student", error);
    }
  };

  // Delete student
  const deleteStudent = async (mssv: string) => {
    // const studentToDelete = students.find((s) => s.mssv === mssv)
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        await StudentService.deleteStudent(mssv);
        setStudents(students.filter((student) => student.mssv !== mssv));
      }
    } catch (error) {
      console.error("Failed to delete student", error);
      toast.error("Lỗi kết nối khi xóa sinh viên");
    }
  };
  // Handle edit button click
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  // Handle add button click
  const handleAdd = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  // Định nghĩa schema cho sinh viên
  const studentSchema = z.object({
    mssv: z.string().optional(),
    fullName: z.string().min(3, "Họ tên không hợp lệ"),
    dateOfBirth: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Ngày sinh không hợp lệ"),
    gender: z.enum(["male", "female", "other"]),
    faculty: z.string(),
    course: z.string(),
    program: z.string(),
    permanentAddress: z
      .object({
        streetAddress: z.string(),
        ward: z.string(),
        district: z.string(),
        province: z.string(),
        country: z.string(),
      })
      .optional(),
    temporaryAddress: z
      .object({
        streetAddress: z.string(),
        ward: z.string(),
        district: z.string(),
        province: z.string(),
        country: z.string(),
      })
      .optional(),
    mailingAddress: z
      .object({
        streetAddress: z.string(),
        ward: z.string(),
        district: z.string(),
        province: z.string(),
        country: z.string(),
      })
      .optional(),
    identityDocument: z
      .union([
        z.object({
          type: z.literal("CMND"),
          number: z.string(),
          issueDate: z.string(),
          issuePlace: z.string(),
          expiryDate: z.string(),
        }),
        z.object({
          type: z.literal("CCCD"),
          number: z.string(),
          issueDate: z.string(),
          issuePlace: z.string(),
          expiryDate: z.string(),
          hasChip: z.boolean(),
        }),
        z.object({
          type: z.literal("Passport"),
          number: z.string(),
          issueDate: z.string(),
          issuePlace: z.string(),
          expiryDate: z.string(),
          issuingCountry: z.string(),
          notes: z.string().optional(),
        }),
      ])
      .optional(),
    nationality: z.string(),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/^(0[0-9]{9})$/, "Số điện thoại không hợp lệ"),
    status: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  });

  const handleImportExport = async (
    action: "import" | "export",
    format: "csv" | "json" | "xml" | "excel",
    data?: Student[]
  ) => {
    if (action === "import" && data) {
      if (!Array.isArray(data)) {
        console.error(
          "Dữ liệu nhập vào không hợp lệ. Phải là một danh sách sinh viên."
        );
        toast.error("Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }

      // Validate danh sách sinh viên
      const studentsSchema = z.array(studentSchema);
      const parsed = studentsSchema.safeParse(data);
      if (!parsed.success) {
        console.error("Dữ liệu không hợp lệ:", parsed.error.errors);
        toast.error("Import không thành công! Vui lòng kiểm tra lại dữ liệu!");
        // Ghi log
        pushLop({
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Imported unsuccessfully.`,
          metadata: {
            action: "import",
            entity: "student",
            user: "admin",
            details: `Imported unsuccessfully.`,
          },
        });
        setIsImportExportOpen(false);
        return;
      }

      try {
        console.log("📤 Bắt đầu import từng sinh viên...");

        let successCount = 0;
        let errorCount = 0;

        // Lấy danh sách MSSV hiện có và tìm số lớn nhất
        const existingMSSVs = students
          .map((s) => s.mssv)
          .filter((mssv) => /^SV\d+$/.test(mssv))
          .map((mssv) => parseInt(mssv.replace("SV", ""), 10));
        let maxMSSV = existingMSSVs.length > 0 ? Math.max(...existingMSSVs) : 5;

        for (const student of data) {
          if (students.some((s) => s.mssv === student.mssv)) {
            maxMSSV++;
            student.mssv = `SV${String(maxMSSV).padStart(3, "0")}`;
          }

          try {
            const data = await StudentService.importStudent(student);
            successCount++;
            setStudents((prev) => [...prev, data.student]);
          } catch (error) {
            console.error(
              "Lỗi kết nối khi thêm sinh viên:",
              student.fullName,
              error
            );
            errorCount++;
          }
        }

        console.log(
          `Import hoàn tất: ${successCount} thành công, ${errorCount} thất bại.`
        );

        if (successCount > 0) {
          toast.success(`Import thành công: ${successCount} sinh viên.`);
          // Ghi log
          pushLop({
            timestamp: new Date().toISOString(),
            level: "info",
            message: `Imported ${successCount} students successfully.`,
            metadata: {
              action: "import",
              entity: "student",
              user: "admin",
              details: `Imported ${successCount} students.`,
            },
          });
        }
        if (errorCount > 0) {
          toast.error("Import không thành công! Vui lòng kiểm tra lại dữ liệu!");
          // Ghi log
          pushLop({
            timestamp: new Date().toISOString(),
            level: "info",
            message: `Imported unsuccessfully.`,
            metadata: {
              action: "import",
              entity: "student",
              user: "admin",
              details: `Imported unsuccessfully.`,
            },
          });
        }

        setIsImportExportOpen(false);
      } catch (error) {
        console.error("Lỗi khi import sinh viên:", error);
        toast.error("Đã xảy ra lỗi khi import sinh viên. Vui lòng thử lại.");
      }
    } else if (action === "export") {
      try {
        let fileContent;
        const fileName = `students.${format}`;

        const data = await StudentService.fetchStudents();

        const students = data;
        // Gắn thông tin đầy đủ cho sinh viên
        students.forEach((student: Student) => {
          student.faculty = getFacultyName(student.faculty);
          student.program = getProgramName(student.program);
          student.status = getStatusInfo(student.status).name;
        });
        // Chuẩn hóa thông tin 3 cột địa chỉ
        const normalizedStudents = students.map((student: Student) => ({
          ...student,
          permanentAddress: [
            student.permanentAddress?.streetAddress,
            student.permanentAddress?.ward,
            student.permanentAddress?.district,
            student.permanentAddress?.province,
            student.permanentAddress?.country,
          ]
            .filter(Boolean)
            .join(", "),
          temporaryAddress: [
            student.temporaryAddress?.streetAddress,
            student.temporaryAddress?.ward,
            student.temporaryAddress?.district,
            student.temporaryAddress?.province,
            student.temporaryAddress?.country,
          ]
            .filter(Boolean)
            .join(", "),
          mailingAddress: [
            student.mailingAddress?.streetAddress,
            student.mailingAddress?.ward,
            student.mailingAddress?.district,
            student.mailingAddress?.province,
            student.mailingAddress?.country,
          ]
            .filter(Boolean)
            .join(", "),
          identityDocument: student.identityDocument
            ? Object.values(student.identityDocument).filter(Boolean).join(", ")
            : "",
        }));
        if (format === "csv") {
          fileContent = Papa.unparse(normalizedStudents);
          const blob = new Blob([fileContent], {
            type: "text/csv;charset=utf-8;",
          });
          saveAs(blob, fileName);
        } else if (format === "json") {
          fileContent = JSON.stringify(students, null, 2);
          const blob = new Blob([fileContent], {
            type: "application/json;charset=utf-8;",
          });
          saveAs(blob, fileName);
        } else if (format === "excel") {
          const worksheet = XLSX.utils.json_to_sheet(normalizedStudents);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "students.xlsx");
        } else if (format === "xml") {
          const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
          const xml = js2xml({ students }, xmlOptions);
          const blob = new Blob([xml], {
            type: "application/xml;charset=utf-8;",
          });
          saveAs(blob, "students.xml");
        }

        // Log the action
        const newLog = {
          id:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Exported ${students.length} students in ${format} format`,
          metadata: {
            action: "export",
            entity: "student",
            user: "admin",
            details: `Exported ${students.length} students in ${format} format`,
          },
        };
        pushLop(newLog);
      } catch (error) {
        console.error("❌ Lỗi khi export sinh viên:", error);
      }
    }
    setIsImportExportOpen(false);
  };

  // Update system config
  const updateSystemConfig = async (newConfig: SystemConfig, flag: string) => {
    // Show toast notification
    //toast.success("Cập nhật cấu hình hệ thống thành công!")
    try {
      if (flag === "status") {
        const res = await StatusService.updateStatusRules(newConfig.statusTransitionRules);
        setStatusRules(await settingService.getFormatRules());
        toast.success(res.message)
        setSystemConfig(newConfig)
        setIsConfigOpen(false)
      } else if (flag === "domains") {
        const res = await settingService.updateDomains(newConfig.allowedEmailDomains);
        toast.success(res.message)
        setSystemConfig(newConfig)
        setIsConfigOpen(false)
      } else if (flag === "phone") {
        const res = await settingService.updatePhoneFormats(newConfig.phoneFormats);
        toast.success(res.message)
        setSystemConfig(newConfig)
        setIsConfigOpen(false)
      }
    } catch (error) {
      console.log("Failed to update status rules", error);
    }
  }

  // Update settings (faculties, statuses, programs)
  const updateSettings = (
    newFaculties: Faculty[],
    newStatuses: StudentStatus[],
    newPrograms: Program[]
  ) => {
    setFaculties(newFaculties);
    setStatuses(newStatuses);
    setPrograms(newPrograms);
    setIsSettingsOpen(false);
  };

  // Get faculty name by ID
  const getFacultyName = (id: string) => {
    return faculties.find((f) => f.id === id)?.name || id;
  };

  // Get status info by ID
  const getStatusInfo = (id: string) => {
    const status = statuses.find((s) => s.id === id);
    return {
      name: status?.name || id,
      color: status?.color || "bg-gray-500",
    };
  };

  // Get program name by ID
  const getProgramName = (id: string) => {
    return programs.find((p) => p.id === id)?.name || id;
  };
  async function handleOpenLogs() {
    try {
      const data = await LogService.fetchLogs();
      setLogs(data);
      setIsLogsOpen(true);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  }

  const [isConfigOpen, setIsConfigOpen] = useState(false);


  const [systemConfig, setSystemConfig] = useState<SystemConfig>({

  });

  return (
    <div className="min-h-screen bg-gray-50">
          <div className="flex gap-2 py-4 text-white items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-white bg-blue-600 hover:text-white hover:bg-blue-700 border-white"
              onClick={() => setIsConfigOpen(true)}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Cấu hình
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white bg-blue-600 hover:text-white hover:bg-blue-700 border-white"
              onClick={() => handleOpenLogs()}
            >
              Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white bg-blue-600 hover:text-white hover:bg-blue-700 border-white"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
          </div>

      <main className="mx-auto ">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng số
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          {statuses.slice(0, 4).map((status) => (
            <Card key={status.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {status.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: status.color }}
                >
                  {stats.byStatus[status.id] || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="students" className="mb-6">
          <TabsList>
            <TabsTrigger value="students">Danh sách Sinh viên</TabsTrigger>
            <TabsTrigger value="faculty">Thống kê theo Khoa</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Danh sách Sinh viên</CardTitle>
                <div className="flex gap-2">
                  <Dialog
                    open={isImportExportOpen}
                    onOpenChange={setIsImportExportOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Import/Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ImportExportDialog
                        onAction={handleImportExport}
                        students={students}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm Sinh viên
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingStudent
                            ? "Cập nhật Thông tin Sinh viên"
                            : "Thêm Sinh viên Mới"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingStudent
                            ? "Chỉnh sửa thông tin sinh viên trong biểu mẫu bên dưới."
                            : "Điền thông tin sinh viên mới vào biểu mẫu bên dưới."}
                        </DialogDescription>
                      </DialogHeader>
                      <StudentForm
                        student={editingStudent || undefined}
                        onSubmit={editingStudent ? updateStudent : addStudent}
                        faculties={faculties}
                        statuses={statuses}
                        programs={programs}
                        statusTransitionRules={statusRules}
                        cancelForm={() => setIsFormOpen(false)}
                        phoneFormats={systemConfig.phoneFormats ?? []}
                        allowedDomains={systemConfig.allowedEmailDomains ?? []}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo tên hoặc MSSV..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <Select
                      value={selectedFaculty}
                      onValueChange={setSelectedFaculty}
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Chọn khoa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả các khoa</SelectItem>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead>MSSV</TableHead>
                        <TableHead>Họ tên</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Ngày sinh
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Khoa
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Chương trình
                        </TableHead>
                        <TableHead>Tình trạng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const statusInfo = getStatusInfo(student.status);

                          return (
                            <TableRow
                              key={student.mssv}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {student.mssv}
                              </TableCell>
                              <TableCell>{student.fullName}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(
                                  student.dateOfBirth
                                ).toLocaleDateString("vi-VN")}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {getFacultyName(student.faculty)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {getProgramName(student.program)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${statusInfo.color} text-white`}
                                >
                                  {statusInfo.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEdit(student)}
                                    className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => deleteStudent(student.mssv)}
                                    className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-10 text-gray-500"
                          >
                            Không tìm thấy sinh viên nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê theo Khoa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {faculties.map((faculty) => (
                    <Card key={faculty.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {faculty.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stats.byFaculty[faculty.id] || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          sinh viên
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ConfigDialog config={systemConfig} statuses={statuses} onSave={updateSystemConfig}/>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <SettingsDialog
            faculties={faculties}
            statuses={statuses}
            programs={programs}
            onSave={updateSettings}
          />
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog
        open={isLogsOpen}
        onOpenChange={(isOpen) => {
          setIsLogsOpen(isOpen);
          try {
            if (!isOpen) {
              async function fetchLogs() {
                const data = await LogService.fetchLogs();
                setLogs(data);
              }
              fetchLogs();
            }
          } catch (error) {
            console.error("Failed to fetch logs", error);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <LogsDialog logs={logs} />
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
