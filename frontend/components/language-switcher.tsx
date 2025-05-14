"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

export default function LanguageSwitcher() {
  const t = useTranslations("settings")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: string) => {
    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "")

    // Construct the new path with the selected locale
    const newPath = value === "vi" ? pathnameWithoutLocale : `/${value}${pathnameWithoutLocale}`

    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white">{t("language")}:</span>
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger className="w-[120px] bg-white/10 text-white border-white/20">
          <SelectValue placeholder={t("selectLanguage")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("english")}</SelectItem>
          <SelectItem value="vi">{t("vietnamese")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
