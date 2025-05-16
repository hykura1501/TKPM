"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import GradeEntry from "@/components/grade-entry"
import GradeExport from "@/components/grade-export"
import GradeManagement from "@/components/grade-management"

export default function TranscriptsPage() {
  const t = useTranslations("transcripts")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      <Tabs defaultValue="management">
        <TabsList>
          <TabsTrigger value="management">{t("managementTab")}</TabsTrigger>
          <TabsTrigger value="entry">{t("entryTab")}</TabsTrigger>
          <TabsTrigger value="export">{t("exportTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <GradeManagement />
        </TabsContent>

        <TabsContent value="entry">
          <GradeEntry />
        </TabsContent>

        <TabsContent value="export">
          <GradeExport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
