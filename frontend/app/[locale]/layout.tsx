import type React from "react"
import "@/app/globals.css"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { getTranslations } from "next-intl/server"
import { Providers } from "@/components/providers"
import enMessages from "../../messages/en.json"
import viMessages from "../../messages/vi.json"
import { ToastContainer } from "react-toastify";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const {locale} = await params
  const t = await getTranslations({ locale, namespace: "app" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const {locale} = await params
  const messages = locale === "en" ? enMessages : viMessages

  const t = await getTranslations({ locale, namespace: "footer" });

   return (
    <html lang={locale}>
      <body className={geistSans.variable}>
        <Providers locale={locale} messages={messages}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
                <footer className="bg-gray-100 border-t py-4">
                  <div className="container mx-auto text-center text-gray-600 text-sm">
                    {t("title")}
                  </div>
                </footer>
              </div>
            </SidebarInset>
            <ToastContainer/>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
