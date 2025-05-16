import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Users, Calendar, FileText, BarChart3 } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function Home({
  params,
}: {
  params: { locale: string }
}) {
  const {locale} = await params
  const t = await getTranslations({ locale, namespace: "home" })
  const nav = await getTranslations({ locale, namespace: "navigation" })
  const common = await getTranslations({ locale, namespace: "common" })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{nav("home")}</h1>
      <p className="text-gray-500">{t("welcome")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              {nav("courses")}
            </CardTitle>
            <CardDescription>{t("coursesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${locale === "vi" ? "" : locale}/courses`}>{t("accessButton")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              {nav("classes")}
            </CardTitle>
            <CardDescription>{t("classesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${locale === "vi" ? "" : locale}/classes`}>{t("accessButton")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              {nav("students")}
            </CardTitle>
            <CardDescription>{t("studentsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${locale === "vi" ? "" : locale}/students`}>{t("accessButton")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              {nav("registration")}
            </CardTitle>
            <CardDescription>{t("registrationDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${locale === "vi" ? "" : locale}/registration`}>{t("accessButton")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
              {nav("transcripts")}
            </CardTitle>
            <CardDescription>{t("transcriptsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${locale === "vi" ? "" : locale}/transcripts`}>{t("accessButton")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
