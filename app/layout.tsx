'use client'
import type { Metadata } from 'next'
import './globals.css'
import CrisisButton from '@/components/CrisisButton'
import { useState, useEffect } from 'react'
import { Lang } from '@/lib/i18n'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ro')
  useEffect(() => {
    const saved = localStorage.getItem('nobet_lang') as Lang
    if (saved) setLang(saved)
  }, [])

  return (
    <html lang="ro">
      <body>
        {children}
        <CrisisButton lang={lang} />
      </body>
    </html>
  )
}
