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
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GradeExport() {
	const t = useTranslations("gradeExport")
	const tStudents = useTranslations("students")
	const common = useTranslations("common")

	// State
	const [studentId, setStudentId] = useState<string>("")
	const [showPreview, setShowPreview] = useState(false)
	const [exportTitle, setExportTitle] = useState(t("title"))
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<any>(null)

	// Ref for printing
	const printRef = useRef<HTMLDivElement>(null)

	// Search for student by ID
	const searchStudent = async () => {
		if (!studentId.trim()) {
			setError(t("searchBeforePreview"))
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
				toast.success(common("success"))
			} else {
				setError(t("noData"))
				setShowPreview(false)
				setSelectedStudent(null)
			}
		} catch (error: any) {
			setError(error.message || common("error"))
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
		if (gpa >= 3.6) return t("classificationExcellent")
		if (gpa >= 3.2) return t("classificationGood")
		if (gpa >= 2.5) return t("classificationFair")
		if (gpa >= 2.0) return t("classificationAverage")
		return t("classificationWeak")
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
				<CardTitle className="text-primary">{t("title")}</CardTitle>
				<CardDescription>{t("description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-end gap-2">
							<div className="flex-1">
								<Label htmlFor="studentId" className="text-sm font-medium">
									{t("studentIdLabel")}
								</Label>
								<Input
									id="studentId"
									value={studentId}
									onChange={(e) => setStudentId(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder={t("studentIdPlaceholder")}
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
								{isLoading ? t("loading") : t("search")}
							</Button>
						</div>

						<div>
							<Label htmlFor="title" className="text-sm font-medium">
								{t("exportTitleLabel")}
							</Label>
							<Input
								id="title"
								value={exportTitle}
								onChange={(e) => setExportTitle(e.target.value)}
								placeholder={t("exportTitlePlaceholder")}
								className="mt-1"
							/>
						</div>
					</div>

					{error && (
						<Alert variant="destructive" className="mt-4 animate-in fade-in">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{t("errorTitle")}</AlertTitle>
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
								{showPreview ? t("hidePreview") : t("preview")}
							</Button>
							<Button
								onClick={() => generatePDF(printRef, { filename: `Bang_diem_${selectedStudent?.studentInfo?.mssv || 'sinhvien'}` })}
								className="bg-primary hover:bg-primary/90 transition-all duration-200"
							>
								<Printer className="h-4 w-4 mr-2" />
								{t("exportPDF")}
							</Button>
							<Button
								variant="secondary"
								onClick={() => generatePDF(printRef, { filename: `Bang_diem_${selectedStudent?.studentInfo?.mssv || 'sinhvien'}` })}
								className="transition-all duration-200"
							>
								<FileDown className="h-4 w-4 mr-2" />
								{t("exportPDFAlternative")}
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
											<p className="font-bold">{t("schoolName")}</p>
											<p>{t("facultyName")}</p>
											<p className="text-sm">{t("documentNumber")}</p>
										</div>
										<div>
											<p className="font-bold">{t("vietnamRepublic")}</p>
											<p>{t("independence")}</p>
											<p className="text-sm">------------------------</p>
										</div>
										<div></div>
									</div>

									<h2 className="text-2xl font-bold text-primary">{exportTitle}</h2>
									<p className="text-muted-foreground">{t("academicYear")}</p>
								</div>

								{/* Student Info */}
								<div className="mb-6 grid grid-cols-2 gap-4">
									<div>
										<table className="text-sm">
											<tbody>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("studentId")}</td>
													<td>{selectedStudent?.studentInfo?.mssv}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("name")}</td>
													<td className="font-medium">{selectedStudent?.studentInfo?.fullName}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("dateOfBirth")}</td>
													<td>{selectedStudent?.studentInfo?.dateOfBirth || "01/01/2000"}</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div className="text-right">
										<table className="text-sm ml-auto">
											<tbody>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("gpa")}</td>
													<td className="font-medium">{selectedStudent?.gpa?.toFixed(2)}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("classification")}</td>
													<td>{getClassification(selectedStudent?.gpa)}</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("educationSystem")}</td>
													<td>
													{selectedStudent?.studentInfo?.educationSystem
														? tStudents(selectedStudent.studentInfo.educationSystem)
														: tStudents("regular")}
													</td>
												</tr>
												<tr>
													<td className="pr-4 py-1 font-semibold">{t("exportDate")}</td>
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
											<TableHead className="w-12 font-bold text-center border">{t("no")}</TableHead>
											<TableHead className="font-bold border">{t("courseCode")}</TableHead>
											<TableHead className="font-bold border">{t("courseName")}</TableHead>
											<TableHead className="font-bold text-center border">{t("credits")}</TableHead>
											<TableHead className="font-bold text-center border">{t("grade")}</TableHead>
											<TableHead className="font-bold text-center border">{t("letterGrade")}</TableHead>
											<TableHead className="font-bold text-center border">{t("gpaEquivalent")}</TableHead>
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
														<p>{t("noData")}</p>
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
												<p><strong>{t("totalCredits")}:</strong> {selectedStudent?.totalCredits}</p>
												<p><strong>{t("completedCourses")}:</strong> {selectedStudent?.totalCourses}</p>
											</div>
											<div className="text-right">
												<p><strong>{t("averageScore")}:</strong> {selectedStudent?.gpa?.toFixed(2)}</p>
												<p><strong>{t("averageScoreSystem")}:</strong> {(selectedStudent?.gpa / 10 * 4)?.toFixed(2)}</p>
											</div>
										</div>
									</div>
								)}

								{/* Signatures */}
								<div className="mt-12 grid grid-cols-2 gap-4 text-center">
									<div>
										<p className="font-bold">{t("exportedBy")}</p>
										<p className="text-sm text-muted-foreground mt-1">{t("signature")}</p>
										<div className="h-16"></div>
										<p>{selectedStudent?.studentInfo?.fullName}</p>
									</div>
									<div>
										<p className="font-bold">{t("headOfDepartment")}</p>
										<p className="text-sm text-muted-foreground mt-1">{t("signatureWithSeal")}</p>
										<div className="h-16"></div>
									</div>
								</div>

								{/* Footer */}
								<div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
									<p>{t("validUntil")} {formatDate(new Date(new Date().setMonth(new Date().getMonth() + 6)))}</p>
									<p>{t("contact")} {t("trainingOffice")}</p>
								</div>
							</div>
						)}
						{!selectedStudent && showPreview && (
							<div className="p-6 bg-white text-center">
								<AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
								<h3 className="text-lg font-medium">{t("noData")}</h3>
								<p className="text-muted-foreground">{t("searchBeforePreview")}</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
