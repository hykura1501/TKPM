"use client"

import { GraduationCap } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

export function Header() {
  const t = useTranslations("app")

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2 text-white" />
          <GraduationCap className="h-8 w-8 mr-3" />
          <h1 className="text-2xl text-black md:text-3xl font-bold">{t("title")}</h1>
        </div>
      </div>
    </header>
  )
}

