'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

export default function GuidePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [open, setOpen] = useState<number | null>(0)
  const tr = t[lang].guide

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{tr.title}</h1>
          <p className="page-subtitle">{tr.subtitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tr.sections.map((section, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}>
              <div onClick={() => setOpen(open === i ? null : i)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.125rem 1.375rem' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, opacity: 0.7 }}>{section.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem', color: 'var(--text)' }}>{section.title}</span>
                <span style={{
                  color: 'var(--text3)', fontSize: '0.75rem',
                  transform: open === i ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>▼</span>
              </div>
              {open === i && (
                <div style={{
                  padding: '0 1.375rem 1.25rem 3.375rem',
                  fontSize: '0.88rem', color: 'var(--text2)',
                  lineHeight: 1.75, borderTop: '1px solid var(--border)',
                  paddingTop: '1rem',
                }}>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
