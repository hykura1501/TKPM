"use client"

import { NextIntlClientProvider } from "next-intl"
import type { ReactNode } from "react"

type ProvidersProps = {
  locale: string
  messages: any
  children: ReactNode
}

export function Providers({ locale, messages, children }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
      {children}
    </NextIntlClientProvider>
  )
}
