"use client"
import { ArrowLeft, Calendar, Mail, MapPin, Phone, School, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

// Validation functions
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone: string) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)
const isValidFaculty = (faculty: string) => ["Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp"].includes(faculty)
const isValidStatus = (status: string) => ["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"].includes(status)

// Get status badge color
const getStatusColor = (status: string) => {
	switch (status) {
		case "Đang học":
			return "bg-green-500"
		case "Đã tốt nghiệp":
			return "bg-blue-500"
		case "Đã thôi học":
			return "bg-red-500"
		case "Tạm dừng học":
			return "bg-yellow-500"
		default:
			return "bg-gray-500"
	}
}

export default function StudentDetailPage() {
	const { mssv } = useParams()
	const [student, setStudent] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const res = await fetch(`/api/students/${mssv}`)
				if (!res.ok) {
					console.log(res);

				}
				const data = await res.json()
				setStudent(data)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		if (mssv) fetchStudent()
	}, [mssv])

	if (loading) {
		return <div className="text-center mt-10">Đang tải...</div>
	}

	if (!student) {
		return <div className="text-center mt-10 text-red-500">Không tìm thấy sinh viên</div>
	}

	// Validate student data
	const emailValid = isValidEmail(student.email)
	const phoneValid = isValidPhone(student.phone)
	const facultyValid = isValidFaculty(student.faculty)
	const statusValid = isValidStatus(student.status)

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center">
				<Button variant="ghost" size="sm" asChild className="mr-4">
					<Link href="/">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Quay lại
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Thông tin chi tiết sinh viên</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Thông tin cá nhân */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<User className="mr-2 h-5 w-5" />
							Thông tin cá nhân
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Mã số sinh viên:</div>
							<div className="col-span-2">{student.mssv}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Họ tên:</div>
							<div className="col-span-2">{student.fullName}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Ngày sinh:</div>
							<div className="col-span-2 flex items-center">
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								{new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
							</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Giới tính:</div>
							<div className="col-span-2">{student.gender}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Địa chỉ:</div>
							<div className="col-span-2 flex items-start">
								<MapPin className="mr-2 h-4 w-4 mt-1 text-muted-foreground" />
								{student.address}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Thông tin học tập */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<School className="mr-2 h-5 w-5" />
							Thông tin học tập
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Khoa:</div>
							<div className="col-span-2">{student.faculty}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Khóa:</div>
							<div className="col-span-2">{student.course}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Chương trình:</div>
							<div className="col-span-2">{student.program}</div>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<div className="font-medium">Tình trạng:</div>
							<div className="col-span-2">
								<Badge className={`${getStatusColor(student.status)}`}>{student.status}</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Thông tin liên hệ */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Thông tin liên hệ</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-6 gap-4">
							<div className="font-medium col-span-1">Email:</div>
							<div className="col-span-5 flex items-center">
								<Mail className="mr-2 h-4 w-4 text-muted-foreground" />
								{student.email}
							</div>
						</div>
						<div className="grid grid-cols-6 gap-4">
							<div className="font-medium col-span-1">Số điện thoại:</div>
							<div className="col-span-5 flex items-center">
								<Phone className="mr-2 h-4 w-4 text-muted-foreground" />
								{student.phone}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
