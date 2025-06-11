"use client"

import { LoadingSpinner } from "./loading-spinner"
import { useTranslations } from "next-intl"

interface PageLoaderProps {
  message?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function PageLoader({ message, size = "lg" }: PageLoaderProps) {
  const t = useTranslations("common")

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size={size} />
      <p className="text-gray-600 text-sm animate-pulse">{message || t("loading")}</p>
    </div>
  )
}
