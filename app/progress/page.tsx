'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [
  { days: 1, label: { ro: 'Prima zi', en: 'Day one' } },
  { days: 7, label: { ro: '7 zile', en: '7 days' } },
  { days: 30, label: { ro: '30 zile', en: '30 days' } },
  { days: 90, label: { ro: '90 zile', en: '90 days' } },
  { days: 365, label: { ro: '1 an', en: '1 year' } },
]

export default function ProgressPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [days, setDays] = useState(0)
  const [journalCount, setJournalCount] = useState(0)
  const [started, setStarted] = useState(false)
  const tr = t[lang].progress

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    const startDate = localStorage.getItem('nobet_start')
    if (startDate) {
      setStarted(true)
      const diff = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000)
      setDays(Math.max(0, diff))
    }
    const journal = localStorage.getItem('nobet_journal')
    if (journal) setJournalCount(JSON.parse(journal).length)
  }, [])

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'short' }).slice(0, 2),
      free: started && days >= (6 - i),
    }
  })

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">{tr.title}</h1>
          <p className="page-subtitle">{tr.subtitle}</p>
        </div>

        {!started ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)', fontSize: '0.92rem' }}>
            {tr.notStarted}
          </div>
        ) : (
          <>
            {/* Stats — fără bani */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--accent)' }}>{days}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.5px', marginTop: '0.25rem' }}>{tr.daysLabel}</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--accent)' }}>{days}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.5px', marginTop: '0.25rem' }}>{tr.streakLabel}</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem', gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--accent)' }}>{journalCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.5px', marginTop: '0.25rem' }}>{tr.journalLabel}</div>
              </div>
            </div>

            {/* Last 7 days */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {tr.weekLabel}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                {last7.map((day, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
                    <div style={{
                      width: '100%', height: 44, borderRadius: '6px',
                      background: day.free ? 'var(--accent)' : 'var(--surface2)',
                      border: `1px solid ${day.free ? 'transparent' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: day.free ? 'rgba(255,255,255,0.7)' : 'var(--text3)',
                    }}>{day.free ? '✓' : '·'}</div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {tr.milestonesTitle}
            </div>
            {MILESTONES.map(m => {
              const reached = days >= m.days
              const pct = Math.min(100, (days / m.days) * 100)
              return (
                <div key={m.days} className="card" style={{
                  padding: '0.875rem 1.125rem', position: 'relative', overflow: 'hidden',
                  background: reached ? 'var(--accent)' : 'var(--surface)',
                  border: `1px solid ${reached ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                  {!reached && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'var(--accent-light)' }} />}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: reached ? 'rgba(255,255,255,0.5)' : 'var(--text3)', minWidth: 28, fontWeight: 600 }}>
                      {reached ? '✓' : m.days}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: reached ? '#fff' : 'var(--text2)', fontWeight: reached ? 500 : 400 }}>
                      {m.label[lang]}
                    </span>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}
