import { GraduationCap } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2 text-white" />
          <GraduationCap className="h-8 w-8 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">Hệ Thống Quản Lý Khóa Học & Bảng Điểm</h1>
        </div>
      </div>
    </header>
  )
}

