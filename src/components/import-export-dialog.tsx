"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUp, FileDown, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import type { Student, ImportFormat } from "@/types/student";

interface ImportExportDialogProps {
  onAction: (action: "import" | "export", format: ImportFormat, data?: Student[]) => void;
  students: Student[];
}

export function ImportExportDialog({ onAction, students }: ImportExportDialogProps) {
  const [selectedTab, setSelectedTab] = useState<"import" | "export">("export");
  const [selectedFormat, setSelectedFormat] = useState<ImportFormat>("json");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log(selectedTab);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  // ✅ Chuẩn hóa dữ liệu sinh viên
  const normalizeStudentData = (data: Record<string, string>[]): Student[] => {
    return data.map((row) => ({
      mssv: row["mssv"] || "",
      fullName: row["fullName"] || "",
      dateOfBirth: row["dateOfBirth"] || "",
      gender: validateGender(row["gender"]),
      faculty: row["faculty"] || "",
      course: row["course"] || "",
      program: row["program"] || "",
      permanentAddress: parseAddress(row["permanentAddress"]),
      temporaryAddress: parseAddress(row["temporaryAddress"]),
      mailingAddress: parseAddress(row["mailingAddress"]),
      identityDocument: parseIdentity(row["identityDocument"]),
      nationality: row["nationality"] || "",
      email: row["email"] || "",
      phone: row["phone"] || "",
      status: row["status"] || "",
      createdAt: row["createdAt"] || "",
      updatedAt: row["updatedAt"] || "",
    })) as Student[];
  };

  // ✅ Kiểm tra giá trị gender hợp lệ
  const validateGender = (gender: string = ""): "male" | "female" | "other" => {
    return ["male", "female", "other"].includes(gender) ? (gender as "male" | "female" | "other") : "male";
  };

  // ✅ Chuyển đổi địa chỉ từ chuỗi sang object
  const parseAddress = (address: string = "") => {
    const parts = address.split(", ");
    return {
      streetAddress: parts[0] || "",
      ward: parts[1] || "",
      district: parts[2] || "",
      province: parts[3] || "",
      country: parts[4] || "",
    };
  };

  // ✅ Chuyển đổi thông tin giấy tờ tùy thân
  const parseIdentity = (identity: string = "") => {
    return {
      type: "CCCD",
      number: identity.split(" - ")[1]?.split(" (")[0] || "",
      issueDate: identity.split("Issued: ")[1]?.split(",")[0] || "",
      expiryDate: identity.split("Expiry: ")[1]?.split(",")[0] || "",
      issuePlace: identity.split("Issued at: ")[1]?.split(",")[0] || "",
      hasChip: identity.includes("Has Chip: True"),
    };
  };

  // ✅ Xử lý Import dữ liệu từ file JSON hoặc Excel
  const handleImport = useCallback(() => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (selectedFile.name.endsWith(".json")) {
          const jsonData = JSON.parse(event.target?.result as string);
          if (Array.isArray(jsonData)) onAction("import", "json", jsonData);
        } else {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);
          onAction("import", "json", normalizeStudentData(jsonData));
        }
      } catch (error) {
        console.error("Lỗi khi nhập dữ liệu:", error);
      }
    };
  
    // selectedFile.name.endsWith(".json") ? reader.readAsText(selectedFile) : reader.readAsArrayBuffer(selectedFile);
  }, [selectedFile, onAction]); 
  

  return (
    <>
      <DialogHeader>
        <DialogTitle>Import/Export Dữ liệu</DialogTitle>
        <DialogDescription>Nhập hoặc xuất dữ liệu sinh viên với nhiều định dạng.</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="export" onValueChange={(value) => setSelectedTab(value as "import" | "export")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Import */}
        <TabsContent value="import">
          <input type="file" accept=".json,.xlsx" onChange={handleFileChange} />
          <Button onClick={handleImport} disabled={!selectedFile}>
            <FileUp className="h-4 w-4 mr-2" /> Import từ File
          </Button>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export">
          <div className="grid grid-cols-2 gap-4">
            {["json", "csv", "excel", "xml"].map((format) => (
              <Card
                key={format}
                onClick={() => setSelectedFormat(format as ImportFormat)}
                className={`cursor-pointer ${selectedFormat === format ? "border-blue-500 bg-blue-50" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {format === "json" && <FileJson className="h-5 w-5 mr-2" />}
                    {format === "csv" && <FileText className="h-5 w-5 mr-2" />}
                    {format === "excel" && <FileSpreadsheet className="h-5 w-5 mr-2" />}
                    {format === "xml" && <FileText className="h-5 w-5 mr-2" />}
                    {format.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Định dạng {format.toUpperCase()}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => onAction("export", selectedFormat)}>
            <FileDown className="h-4 w-4 mr-2" /> Export ({students.length} sinh viên)
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
}
