"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileDown, Printer, Eye, Search, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import studentService from "@/services/studentService"
import { toast } from "react-toastify"
import generatePDF from 'react-to-pdf';

export default function GradeExport() {
	// State
	const [studentId, setStudentId] = useState<string>("")
	const [showPreview, setShowPreview] = useState(false)
	const [exportTitle, setExportTitle] = useState("BẢNG ĐIỂM SINH VIÊN")
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<any>(null)

	// Ref for printing
	const printRef = useRef<HTMLDivElement>(null)

	// Search for student by ID
	const searchStudent = async () => {
		if (!studentId.trim()) {
			setError("Vui lòng nhập mã số sinh viên")
			setShowPreview(false)
			return
		}

		try {
			setIsLoading(true)
			setError(null)

			const data = await studentService.getGradeByStudentId(studentId)

			if (data) {
				setSelectedStudent(data)
				setShowPreview(true)
				toast.success("Tìm thấy thông tin sinh viên")
			} else {
				setError("Không tìm thấy sinh viên với mã số này")
				setShowPreview(false)
				setSelectedStudent(null)
			}
		} catch (error: any) {
			setError(error.message || "Đã xảy ra lỗi khi tìm kiếm sinh viên")
			setShowPreview(false)
			setSelectedStudent(null)
		} finally {
			setIsLoading(false)
		}
	}

	// Get letter grade
	const getLetterGrade = (score: number): string => {
		if (score >= 9.0) return "A+"
		if (score >= 8.5) return "A"
		if (score >= 8.0) return "B+"
		if (score >= 7.0) return "B"
		if (score >= 6.5) return "C+"
		if (score >= 5.5) return "C"
		if (score >= 5.0) return "D+"
		if (score >= 4.0) return "D"
		return "F"
	}

	// Get GPA equivalent
	const getGPAEquivalent = (score: number): number => {
		if (score >= 9.0) return 4.0
		if (score >= 8.5) return 3.7
		if (score >= 8.0) return 3.5
		if (score >= 7.0) return 3.0
		if (score >= 6.5) return 2.5
		if (score >= 5.5) return 2.0
		if (score >= 5.0) return 1.5
		if (score >= 4.0) return 1.0
		return 0.0
	}

	// Get classification based on GPA
	const getClassification = (gpa: number): string => {
		if (gpa >= 3.6) return "Xuất sắc"
		if (gpa >= 3.2) return "Giỏi"
		if (gpa >= 2.5) return "Khá"
		if (gpa >= 2.0) return "Trung bình"
		return "Yếu"
	}

	// Format date to Vietnamese format
	const formatDate = (date = new Date()): string => {
		return date.toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	}

	// Handle enter key on search input
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			searchStudent()
		}
	}

	return (
		<Card className="shadow-md">
			<CardHeader>
				<CardTitle className="text-primary">Xuất Bảng Điểm</CardTitle>
				<CardDescription>Nhập mã số sinh viên để xem và xuất bảng điểm</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-end gap-2">
							<div className="flex-1">
								<Label htmlFor="studentId" className="text-sm font-medium">
									Mã số sinh viên
								</Label>
								<Input
									id="studentId"
									value={studentId}
									onChange={(e) => setStudentId(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Nhập mã số sinh viên (VD: SV001)"
									className="mt-1"
								/>
							</div>
							<Button
								onClick={searchStudent}
								disabled={isLoading}
								className="transition-all duration-200"
							>
								{isLoading ? (
									<div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
								) : (
									<Search className="h-4 w-4 mr-2" />
								)}
								{isLoading ? "Đang tìm..." : "Tìm kiếm"}
							</Button>
						</div>

						<div>
							<Label htmlFor="title" className="text-sm font-medium">
								Tiêu đề bảng điểm
							</Label>
							<Input
								id="title"
								value={exportTitle}
								onChange={(e) => setExportTitle(e.target.value)}
								placeholder="Nhập tiêu đề bảng điểm"
								className="mt-1"
							/>
						</div>
					</div>

					{error && (
						<Alert variant="destructive" className="mt-4 animate-in fade-in">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Lỗi</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{selectedStudent && (
						<div className="flex justify-end space-x-2 mt-4">
							<Button
								variant="outline"
								onClick={() => setShowPreview(!showPreview)}
								className="transition-all duration-200"
							>
								<Eye className="h-4 w-4 mr-2" />
								{showPreview ? "Ẩn xem trước" : "Xem trước"}
							</Button>
							<Button
								onClick={() => generatePDF(printRef, { filename: `Bang_diem_${selectedStudent?.studentInfo?.mssv || 'sinhvien'}` })}
								className="bg-primary hover:bg-primary/90 transition-all duration-200"
							>
								<Printer className="h-4 w-4 mr-2" />
								In bảng điểm
							</Button>
							<Button
								variant="secondary"
								onClick={() => generatePDF(printRef, { filename: `Bang_diem_${selectedStudent?.studentInfo?.mssv || 'sinhvien'}` })}
								className="transition-all duration-200"
							>
								<FileDown className="h-4 w-4 mr-2" />
								Xuất PDF
							</Button>
						</div>
					)}

					{/* Phần in ấn - để ở ngoài điều kiện hiển thị */}
					<div className="mt-6 border rounded-md p-2 bg-gray-50">
						{selectedStudent && (
							<div
								ref={printRef}
								className={`p-6 bg-white shadow-sm ${showPreview ? 'block' : 'hidden'}`}
								style={{ display: showPreview ? 'block' : 'none' }}
							>
								{/* Header */}
								<div className="text-center mb-8">
									<div className="grid grid-cols-3 mb-4">
										<div className="text-left">
											<p className="font-bold">TRƯỜNG ĐẠI HỌC XYZ</p>
											<p>KHOA CÔNG NGHỆ THÔNG TIN</p>
											<p className="text-sm">Số: ......./ĐHXYZ</p>
										</div>
										<div>
											<p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
											<p>Độc lập - Tự do - Hạnh phúc</p>
											<p className="text-sm">------------------------</p>
										</div>
										<div></div>
									</div>

									<h2 className="text-2xl font-bold text-primary">{exportTitle}</h2>
									<p className="text-muted-foreground">Năm học: 2023-2024 | Học kỳ: II</p>
								</div>

								{/* Student Info */}
								<div className="mb-6 grid grid-cols-2 gap-4">
									<div>
										<table className="text-sm">
											<tbody>
												<tr>
													<td className="pr-4 py-1 font-semibold">Mã số sinh viên:</td>
													<td>{selectedStudent?.studentInfo?.mssv}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">Họ và tên:</td>
													<td className="font-medium">{selectedStudent?.studentInfo?.fullName}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">Ngày sinh:</td>
													<td>{selectedStudent?.studentInfo?.dateOfBirth || "01/01/2000"}</td>
												</tr>
												{/* <tr>
													<td className="pr-4 py-1 font-semibold">Chương trình đào tạo:</td>
													<td>{selectedStudent?.studentInfo?.program || "Cử nhân"}</td>
												</tr> */}
											</tbody>
										</table>
									</div>
									<div className="text-right">
										<table className="text-sm ml-auto">
											<tbody>
												<tr>
													<td className="pr-4 py-1 font-semibold">Điểm trung bình (GPA):</td>
													<td className="font-medium">{selectedStudent?.gpa?.toFixed(2)}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">Xếp loại:</td>
													<td>{getClassification(selectedStudent?.gpa)}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">Hệ đào tạo:</td>
													<td>{selectedStudent?.studentInfo?.educationSystem || "Chính quy"}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">Ngày xuất bảng điểm:</td>
													<td>{formatDate()}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								{/* Grades Table */}
								<Table className="border">
									<TableHeader className="bg-gray-50">
										<TableRow>
											<TableHead className="w-12 font-bold text-center border">STT</TableHead>
											<TableHead className="font-bold border">Mã môn học</TableHead>
											<TableHead className="font-bold border">Tên môn học</TableHead>
											<TableHead className="font-bold text-center border">Số tín chỉ</TableHead>
											<TableHead className="font-bold text-center border">Điểm số</TableHead>
											<TableHead className="font-bold text-center border">Điểm chữ</TableHead>
											<TableHead className="font-bold text-center border">Hệ 4</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{selectedStudent?.grades?.length > 0 ? (
											selectedStudent.grades.map((grade: any, index: number) => (
												<TableRow key={`grade-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
													<TableCell className="text-center border">{index + 1}</TableCell>
													<TableCell className="border">{grade?.classInfo?.courseInfo?.code}</TableCell>
													<TableCell className="border">{grade?.classInfo?.courseInfo?.name}</TableCell>
													<TableCell className="text-center border">{grade?.classInfo?.courseInfo?.credits}</TableCell>
													<TableCell className="text-center border font-medium">{grade?.grade?.toFixed(1)}</TableCell>
													<TableCell className="text-center border">{getLetterGrade(grade?.grade)}</TableCell>
													<TableCell className="text-center border">{getGPAEquivalent(grade?.grade).toFixed(1)}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} className="text-center py-8 border">
													<div className="flex flex-col items-center justify-center text-muted-foreground">
														<AlertCircle className="h-8 w-8 mb-2" />
														<p>Không có dữ liệu điểm cho sinh viên này</p>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>

								{/* Summary */}
								{selectedStudent?.grades?.length > 0 && (
									<div className="mt-6 border p-4 bg-gray-50 rounded-md">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p><strong>Tổng số tín chỉ tích lũy:</strong> {selectedStudent?.totalCredits}</p>
												<p><strong>Số môn học đã hoàn thành:</strong> {selectedStudent?.totalCourses}</p>
											</div>
											<div className="text-right">
												<p><strong>Điểm trung bình (hệ 10):</strong> {selectedStudent?.gpa?.toFixed(2)}</p>
												<p><strong>Điểm trung bình (hệ 4):</strong> {(selectedStudent?.gpa / 10 * 4)?.toFixed(2)}</p>
											</div>
										</div>
									</div>
								)}

								{/* Signatures */}
								<div className="mt-12 grid grid-cols-2 gap-4 text-center">
									<div>
										<p className="font-bold">NGƯỜI LẬP BẢNG ĐIỂM</p>
										<p className="text-sm text-muted-foreground mt-1">(Ký và ghi rõ họ tên)</p>
										<div className="h-16"></div>
										<p>{selectedStudent?.studentInfo?.fullName}</p>
									</div>
									<div>
										<p className="font-bold">TRƯỞNG KHOA</p>
										<p className="text-sm text-muted-foreground mt-1">(Ký, đóng dấu và ghi rõ họ tên)</p>
										<div className="h-16"></div>
									</div>
								</div>

								{/* Footer */}
								<div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
									<p>Bảng điểm này có giá trị đến ngày {formatDate(new Date(new Date().setMonth(new Date().getMonth() + 6)))}</p>
									<p>Mọi thắc mắc về bảng điểm vui lòng liên hệ: Phòng Đào tạo - Trường Đại học XYZ</p>
								</div>
							</div>
						)}
						{!selectedStudent && showPreview && (
							<div className="p-6 bg-white text-center">
								<AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
								<h3 className="text-lg font-medium">Không có dữ liệu</h3>
								<p className="text-muted-foreground">Vui lòng tìm kiếm sinh viên trước khi xem trước hoặc xuất PDF</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}