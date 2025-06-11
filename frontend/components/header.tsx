"use client"

import { GraduationCap, Bell, User, Search, Settings } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LanguageSwitcher from "@/components/language-switcher"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

export function Header() {
  const t = useTranslations("app")
  const pathname = usePathname()

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = pathname.split("/").pop()
    switch (path) {
      case "students":
        return t("navigation.students")
      case "courses":
        return t("navigation.courses")
      case "classes":
        return t("navigation.classes")
      case "registration":
        return t("navigation.registration")
      case "transcripts":
        return t("navigation.transcripts")
      case "settings":
        return t("navigation.settings")
      default:
        return t("navigation.home")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg backdrop-blur supports-[backdrop-filter]:bg-blue-600/95">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-white hover:bg-white/10 transition-colors" />

            <div className="flex items-center space-x-3">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-blue-100" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white tracking-tight">{t("title")}</h1>
                <p className="text-xs text-blue-100 font-medium">
                  {t("subtitle", { default: "Education Management System" })}
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              <Input
                placeholder={t("search.placeholder", { default: "Search students, courses..." })}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t("notifications.title", { default: "Notifications" })}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">New student registration</div>
                  <div className="text-sm text-muted-foreground">John Doe has registered for Computer Science</div>
                  <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">Course update</div>
                  <div className="text-sm text-muted-foreground">Mathematics 101 schedule has been updated</div>
                  <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">System maintenance</div>
                  <div className="text-sm text-muted-foreground">Scheduled maintenance tonight at 2 AM</div>
                  <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                    <AvatarFallback className="bg-blue-500 text-white">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@school.edu</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile.title", { default: "Profile" })}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("settings.title", { default: "Settings" })}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <span>{t("auth.logout", { default: "Log out" })}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumb Section */}
        <div className="border-t border-white/10 py-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-blue-100">{t("navigation.home")}</span>
            <span className="text-blue-200">/</span>
            <span className="text-white font-medium">{getCurrentPageName()}</span>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
    </header>
  )
}
