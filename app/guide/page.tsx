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
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">{tr.title}</h1>
            <p className="page-subtitle">{tr.subtitle}</p>
          </div>
          <div className="lang-switch" style={{ flexShrink: 0, marginTop: '0.25rem' }}>
            <button className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')}>RO</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {tr.sections.map((section, i) => (
            <div
              key={i}
              className="card"
              style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
            >
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1rem 1.25rem',
                }}
              >
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{section.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: '0.95rem' }}>{section.title}</span>
                <span style={{
                  color: 'var(--text3)',
                  fontSize: '0.8rem',
                  transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.25s',
                }}>▼</span>
              </div>
              {open === i && (
                <div style={{
                  padding: '0 1.25rem 1.125rem 3.75rem',
                  fontSize: '0.88rem',
                  color: 'var(--text2)',
                  lineHeight: 1.7,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.875rem',
                }}>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Nav lang={lang} onLangChange={setLang} />
    </>
  )
}
