"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Settings,
  Home,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "../styles/sidebar.module.css"

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navigation");

  // Helper to create localized links
  const createLocalizedHref = (path: string) => {
    return locale === "vi" ? path : `/${locale}${path}`;
  };

  // Check if path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === `/${locale}` || pathname === "/";
    }
    return pathname.includes(path);
  };

  const menuItems = [
    {
      title: t("home"),
      url: "/",
      icon: Home,
      badge: null,
      description: "Dashboard overview",
    },
    {
      title: t("courses"),
      url: "/courses",
      icon: BookOpen,
      badge: "12",
      description: "Manage courses",
    },
    {
      title: t("classes"),
      url: "/classes",
      icon: Calendar,
      badge: "5",
      description: "Class schedules",
    },
    {
      title: t("students"),
      url: "/students",
      icon: Users,
      badge: "248",
      description: "Student records",
    },
    {
      title: t("registration"),
      url: "/registration",
      icon: FileText,
      badge: "New",
      description: "Course registration",
    },
    {
      title: t("transcripts"),
      url: "/transcripts",
      icon: BarChart3,
      badge: null,
      description: "Academic records",
    },
  ];

  return (
    <Sidebar className= {`${styles.background} border-r border-border/40 bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-950/80`}>
      {/* Header */}
      <SidebarHeader className="border-b border-border/40  from-blue-600 via-blue-700 to-indigo-700 text-black">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="relative">
            {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur opacity-60"></div> */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-1.5">
              <GraduationCap className="h-5 w-5 text-black" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">
              {t("title")}
            </span>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                className={cn(
                  "group relative h-12 px-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50",
                  isActive(item.url) &&
                    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700"
                )}
              >
                <Link
                  href={createLocalizedHref(item.url)}
                  className="flex items-center gap-3 w-full"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                      isActive(item.url)
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {item.title}
                      </span>
                    </div>
                    {/* <span
                      className={cn(
                        "text-xs opacity-70 truncate block",
                        isActive(item.url)
                          ? "text-white/80"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {item.description}
                    </span> */}
                  </div>

                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform opacity-0 group-hover:opacity-100",
                      isActive(item.url) && "opacity-100 text-white"
                    )}
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Quick Stats
        <div className="px-3 py-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Quick Stats
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg">
              <div className="font-semibold text-blue-600">248</div>
              <div className="text-slate-500">Students</div>
            </div>
            <div className="text-center p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg">
              <div className="font-semibold text-green-600">12</div>
              <div className="text-slate-500">Courses</div>
            </div>
          </div>
        </div> */}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={`${styles.background} border-t border-border/40 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              className={cn(
                "group h-12  mb-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700",
                isActive("/settings") &&
                  "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg"
              )}
            >
              <Link
                href={createLocalizedHref("/settings")}
                className="flex items-center gap-3 w-full"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                    isActive("/settings")
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{t("settings")}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 ml-auto transition-transform opacity-0 group-hover:opacity-100",
                    isActive("/settings") && "opacity-100"
                  )}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
