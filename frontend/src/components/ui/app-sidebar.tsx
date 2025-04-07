"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, GraduationCap, FileText, BarChart3, Settings, Home, Calendar } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <GraduationCap className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg">Quản lý Đào tạo</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                <span>Trang chủ</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/courses"}>
              <Link href="/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Quản lý Khóa học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/classes"}>
              <Link href="/classes">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Quản lý Lớp học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/students"}>
              <Link href="/students">
                <Users className="h-4 w-4 mr-2" />
                <span>Quản lý Sinh viên</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/registration"}>
              <Link href="/registration">
                <FileText className="h-4 w-4 mr-2" />
                <span>Đăng ký Khóa học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/transcripts"}>
              <Link href="/transcripts">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Bảng điểm</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                <span>Cài đặt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

