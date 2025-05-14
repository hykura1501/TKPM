import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"




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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>{children}</>
  )
}



import './globals.css'