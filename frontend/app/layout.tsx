import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý Khóa Học & Bảng Điểm",
  description: "Hệ thống quản lý khóa học và bảng điểm sinh viên",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1  container mx-auto py-6 px-4">{children}</main>
              <footer className="bg-gray-100 border-t py-4">
                <div className="container mx-auto text-center text-gray-600 text-sm">
                  © {new Date().getFullYear()} Hệ Thống Quản Lý Khóa Học & Bảng Điểm
                </div>
              </footer>
            </div>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}



import './globals.css'