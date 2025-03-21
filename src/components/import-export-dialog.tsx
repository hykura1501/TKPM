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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Xử lý khi chọn file JSON
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Xử lý import từ JSON
  const handleImport = () => {
    if (!selectedFile) {
      console.error("Vui lòng chọn một file JSON để nhập dữ liệu.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        if (!Array.isArray(jsonData)) {
          console.error("File JSON không hợp lệ. Dữ liệu phải là một mảng sinh viên.");
          return;
        }
        onAction("import", "json", jsonData); // Import chỉ dùng JSON
      } catch (error) {
        console.error("Lỗi đọc file JSON:", error);
      }
    };
    reader.readAsText(selectedFile);
  };

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

        {/* Tab Import (Chỉ hỗ trợ JSON) */}
        <TabsContent value="import" className="space-y-4">
          <p className="text-sm text-muted-foreground">Chỉ hỗ trợ nhập dữ liệu từ file JSON.</p>

          {/* Input chọn file JSON */}
          <input type="file" accept=".json" onChange={handleFileChange} className="border p-2 w-full" />

          <div className="flex justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {selectedFile ? `📂 File đã chọn: ${selectedFile.name}` : "Chưa chọn file"}
            </p>
            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700" disabled={!selectedFile}>
              <FileUp className="h-4 w-4 mr-2" />
              Import từ JSON
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

