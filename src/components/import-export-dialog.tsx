"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FileUp, FileDown, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import type { Student, ImportFormat } from "@/types/student"

type ImportExportDialogProps = {
  onAction: (action: "import" | "export", format: ImportFormat, data?: any) => void
  students: Student[]
}

export function ImportExportDialog({ onAction, students }: ImportExportDialogProps) {
  const [selectedTab, setSelectedTab] = useState<"import" | "export">("export")
  const [selectedFormat, setSelectedFormat] = useState<ImportFormat>("json")

  const handleImport = () => {
    // In a real app, we would handle file upload and parsing
    // For demo purposes, we'll just simulate importing some data
    const sampleImportData = [
      {
        id: "SV999",
        fullName: "Sinh Viên Import",
        dateOfBirth: "2000-01-01",
        gender: "male",
        faculty: "faculty-1",
        course: "2020",
        program: "program-1",
        email: "import@example.com",
        phone: "0901234567",
        status: "status-1",
        nationality: "Việt Nam",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    onAction("import", selectedFormat, sampleImportData)
  }

  const handleExport = () => {
    onAction("export", selectedFormat)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Import/Export Dữ liệu</DialogTitle>
        <DialogDescription>Nhập hoặc xuất dữ liệu sinh viên với nhiều định dạng khác nhau.</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="export" onValueChange={(value) => setSelectedTab(value as "import" | "export")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <p className="text-sm text-muted-foreground">Chọn định dạng file để nhập dữ liệu sinh viên vào hệ thống.</p>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "json" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("json")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileJson className="h-5 w-5 mr-2" />
                  JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng dữ liệu cấu trúc phổ biến</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "csv" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("csv")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng văn bản đơn giản, dễ sử dụng</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "excel" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("excel")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Excel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng bảng tính Microsoft Excel</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "xml" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("xml")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  XML
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng ngôn ngữ đánh dấu mở rộng</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Đã chọn: <span className="font-medium">{selectedFormat.toUpperCase()}</span>
            </p>
            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700">
              <FileUp className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <p className="text-sm text-muted-foreground">Chọn định dạng file để xuất dữ liệu sinh viên từ hệ thống.</p>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "json" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("json")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileJson className="h-5 w-5 mr-2" />
                  JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng dữ liệu cấu trúc phổ biến</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "csv" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("csv")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng văn bản đơn giản, dễ sử dụng</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "excel" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("excel")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Excel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng bảng tính Microsoft Excel</CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-blue-500 ${selectedFormat === "xml" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setSelectedFormat("xml")}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  XML
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Định dạng ngôn ngữ đánh dấu mở rộng</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Đã chọn: <span className="font-medium">{selectedFormat.toUpperCase()}</span>
            </p>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <FileDown className="h-4 w-4 mr-2" />
              Export ({students.length} sinh viên)
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

