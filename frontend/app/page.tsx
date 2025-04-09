import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Users, Calendar, FileText, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trang chủ</h1>
      <p className="text-gray-500">
        Chào mừng đến với Hệ thống Quản lý Khóa học & Bảng điểm Sinh viên. Sử dụng các liên kết bên dưới hoặc thanh điều
        hướng để truy cập các chức năng của hệ thống.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Quản lý Khóa học
            </CardTitle>
            <CardDescription>Thêm, cập nhật và quản lý thông tin khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/courses">Truy cập</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Quản lý Lớp học
            </CardTitle>
            <CardDescription>Mở lớp học và quản lý thông tin lớp học</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/classes">Truy cập</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Quản lý Sinh viên
            </CardTitle>
            <CardDescription>Quản lý thông tin sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/students">Truy cập</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Đăng ký Khóa học
            </CardTitle>
            <CardDescription>Đăng ký và hủy đăng ký khóa học cho sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/registration">Truy cập</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
              Bảng điểm
            </CardTitle>
            <CardDescription>Xem và in bảng điểm sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/transcripts">Truy cập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

