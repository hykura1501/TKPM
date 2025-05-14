"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const common = useTranslations("common")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("schoolInfo")}</CardTitle>
          <CardDescription>{t("schoolInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-name">{t("schoolName")}</Label>
            <Input id="school-name" defaultValue={t("defaultSchoolName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-address">{t("schoolAddress")}</Label>
            <Input id="school-address" defaultValue={t("defaultSchoolAddress")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-phone">{t("schoolPhone")}</Label>
            <Input id="school-phone" defaultValue={t("defaultSchoolPhone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-email">{t("schoolEmail")}</Label>
            <Input id="school-email" defaultValue={t("defaultSchoolEmail")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button>{common("save")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("academicSettings")}</CardTitle>
          <CardDescription>{t("academicSettingsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-semester">{t("currentSemester")}</Label>
            <Select defaultValue="2023-2">
              <SelectTrigger id="current-semester">
                <SelectValue placeholder={t("selectSemester")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-1">{t("semesterFall")} 2023</SelectItem>
                <SelectItem value="2023-2">{t("semesterSpring")} 2023</SelectItem>
                <SelectItem value="2023-3">{t("semesterSummer")} 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passing-grade">{t("passingGrade")}</Label>
            <Input id="passing-grade" type="number" defaultValue="5" min="0" max="10" step="0.1" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>{common("save")}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
