'use client'
import { useState, useEffect } from 'react'
import { Lang } from '@/lib/i18n'
import CrisisButton from './CrisisButton'

export default function CrisisWrapper() {
  const [lang, setLang] = useState<Lang>('ro')
  useEffect(() => {
    const saved = localStorage.getItem('nobet_lang') as Lang
    if (saved) setLang(saved)
    const handler = () => {
      const l = localStorage.getItem('nobet_lang') as Lang
      if (l) setLang(l)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])
  return <CrisisButton lang={lang} />
}
