"use client"

import { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { SUPPORTED_LOCALES } from "@/locales"

type TranslationField = {
  key: string
  label: string
  type: "input" | "textarea"
  required?: boolean
}

type TranslationData = {
  [key: string]: string
}

type TranslationsByLocale = {
  [locale: string]: TranslationData
}

interface TranslationManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityType: string
  entityId?: string
  fields: TranslationField[]
  initialTranslations?: TranslationsByLocale
  onSave: (translations: TranslationsByLocale) => void
}

export function TranslationManager({
  open,
  onOpenChange,
  entityType,
  entityId,
  fields,
  initialTranslations = {},
  onSave,
}: TranslationManagerProps) {
  const t = useTranslations("translations")
  const currentLocale = useLocale()
  const { toast } = useToast()
  const locales = SUPPORTED_LOCALES

  // Khởi tạo state translations
  const [translations, setTranslations] = useState<TranslationsByLocale>(initialTranslations)
  const [activeTab, setActiveTab] = useState(currentLocale)

  // Đồng bộ translations với initialTranslations khi prop thay đổi
  useEffect(() => {
    setTranslations(initialTranslations)
  }, [initialTranslations])

  // Khởi tạo translations mặc định chỉ khi mount lần đầu
  useEffect(() => {
    const defaultTranslations: TranslationsByLocale = {}
    locales.forEach((locale) => {
      if (!initialTranslations[locale]) {
        defaultTranslations[locale] = {}
        fields.forEach((field) => {
          defaultTranslations[locale][field.key] = ""
        })
      }
    })
    if (Object.keys(defaultTranslations).length > 0) {
      setTranslations((prev) => ({
        ...prev,
        ...defaultTranslations,
      }))
    }
  }, [fields, locales, initialTranslations]) // Loại bỏ translations khỏi dependencies

  // Handle input change
  const handleInputChange = (locale: string, key: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value,
      },
    }))
  }

  // Copy translations from one locale to another
  const copyFromLocale = (sourceLocale: string) => {
    if (sourceLocale === activeTab) {
      toast({
        title: t("cannotCopySameLocale"),
        description: t("selectDifferentLocale"),
        variant: "destructive",
      })
      return
    }
    setTranslations((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...prev[sourceLocale],
      },
    }))
    toast({
      title: t("translationsCopied"),
      description: t("translationsCopiedFrom", { locale: sourceLocale.toUpperCase() }),
    })
  }

  // Validate translations
  const validateTranslations = () => {
    for (const locale of locales) {
      for (const field of fields) {
        if (field.required && (!translations[locale] || !translations[locale][field.key])) {
          toast({
            title: t("validationError"),
            description: t("requiredFieldMissing", { field: field.label, locale: locale.toUpperCase() }),
            variant: "destructive",
          })
          setActiveTab(locale)
          return false
        }
      }
    }
    return true
  }

  // Handle save
  const handleSave = () => {
    if (validateTranslations()) {
      onSave(translations)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("manageTranslations")}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {locales.map((locale) => (
                <TabsTrigger key={locale} value={locale}>
                  {locale.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex gap-2">
              {locales
                .filter((locale) => locale !== activeTab)
                .map((locale) => (
                  <Button key={locale} variant="outline" size="sm" onClick={() => copyFromLocale(locale)}>
                    {t("copyFrom")} {locale.toUpperCase()}
                  </Button>
                ))}
            </div>
          </div>
          {locales.map((locale) => (
            <TabsContent key={locale} value={locale} className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${locale}-${field.key}`}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {field.type === "input" ? (
                    <Input
                      id={`${locale}-${field.key}`}
                      value={translations[locale]?.[field.key] || ""}
                      onChange={(e) => handleInputChange(locale, field.key, e.target.value)}
                      placeholder={`${field.label} (${locale.toUpperCase()})`}
                    />
                  ) : (
                    <Textarea
                      id={`${locale}-${field.key}`}
                      value={translations[locale]?.[field.key] || ""}
                      onChange={(e) => handleInputChange(locale, field.key, e.target.value)}
                      placeholder={`${field.label} (${locale.toUpperCase()})`}
                      rows={4}
                    />
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("saveTranslations")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}