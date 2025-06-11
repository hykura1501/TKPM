"use client"

import { LoadingSpinner } from "./loading-spinner"
import { useTranslations } from "next-intl"

interface TableLoaderProps {
  columns: number
  rows?: number
}

export function TableLoader({ columns, rows = 5 }: TableLoaderProps) {
  const t = useTranslations("common")

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
      <tr>
        <td colSpan={columns} className="text-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="md" />
            <span className="text-sm text-gray-500">{t("loadingData")}</span>
          </div>
        </td>
      </tr>
    </>
  )
}
