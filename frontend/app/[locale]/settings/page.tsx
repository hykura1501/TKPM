"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (value: string) => {
    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "")

    // Construct the new path with the selected locale
    const newPath = value === "vi" ? pathnameWithoutLocale : `/${value}${pathnameWithoutLocale}`

    router.push(newPath)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t("general")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("general")}</CardTitle>
              <CardDescription>{t("generalDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">{t("schoolName")}</Label>
                <Input id="school-name" defaultValue="Trường Đại học ABC" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic-year">{t("currentAcademicYear")}</Label>
                <Input id="academic-year" defaultValue="2023-2024" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">{t("currentSemester")}</Label>
                <select id="semester" className="w-full p-2 border rounded-md">
                  <option value="1">Học kỳ I</option>
                  <option value="2">Học kỳ II</option>
                  <option value="summer">Học kỳ Hè</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Select value={locale} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("english")}</SelectItem>
                    <SelectItem value="vi">{t("vietnamese")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("notifications")}</CardTitle>
              <CardDescription>{t("notificationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("emailNotifications")}</p>
                  <p className="text-sm text-gray-500">{t("emailNotificationsDescription")}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("systemNotifications")}</p>
                  <p className="text-sm text-gray-500">{t("systemNotificationsDescription")}</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("security")}</CardTitle>
              <CardDescription>{t("securityDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t("currentPassword")}</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">{t("newPassword")}</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("confirmNewPassword")}</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button>{t("changePassword")}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
