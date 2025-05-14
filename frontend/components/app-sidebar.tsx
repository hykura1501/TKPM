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

import styles from "@/styles/sidebar.module.css"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className={`${styles.background} text-white`}>
      <SidebarHeader className="flex items-center px-4 py-2 pt-4">
        <span className="font-bold text-lg flex"><GraduationCap className="h-6 w-6 text-white mr-2" />Quản lý Đào tạo</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"} className={`${pathname === "/" ? styles.active : ""}`}>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                <span >Trang chủ</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/courses"} className={`${pathname === "/courses" ? styles.active : ""}`}>
              <Link href="/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Quản lý Khóa học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/classes"} className={`${pathname === "/classes" ? styles.active : ""}`}>
              <Link href="/classes">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Quản lý Lớp học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/students"} className={`${pathname === "/students" ? styles.active : ""}`}>
              <Link href="/students">
                <Users className="h-4 w-4 mr-2" />
                <span>Quản lý Sinh viên</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/registration"} className={`${pathname === "/registration" ? styles.active : ""}`}>
              <Link href="/registration">
                <FileText className="h-4 w-4 mr-2" />
                <span>Đăng ký Khóa học</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/transcripts"} className={`${pathname === "/transcripts" ? styles.active : ""}`}>
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
            <SidebarMenuButton asChild isActive={pathname === "/settings"} className={`${pathname === "/settings" ? styles.active : ""}`}>
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

