'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [
  { days: 1, label: { ro: 'Prima zi', en: 'Day one' } },
  { days: 3, label: { ro: '3 zile', en: '3 days' } },
  { days: 7, label: { ro: '7 zile', en: '7 days' } },
  { days: 30, label: { ro: '30 zile', en: '30 days' } },
  { days: 90, label: { ro: '90 zile', en: '90 days' } },
  { days: 365, label: { ro: '1 an', en: '1 year' } },
]

function HealthScore({ score, lang }: { score: number; lang: Lang }) {
  const getColor = () => {
    if (score >= 75) return '#22c55e'
    if (score >= 45) return '#f59e0b'
    return '#ef4444'
  }

  const getLabel = () => {
    if (lang === 'ro') {
      if (score >= 75) return 'Excelent'
      if (score >= 45) return 'În progres'
      return 'Fragil'
    } else {
      if (score >= 75) return 'Excellent'
      if (score >= 45) return 'In progress'
      return 'Fragile'
    }
  }

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '1.5rem',
      textAlign: 'center',
      marginBottom: '1rem',
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--text3)',
        marginBottom: '1rem',
      }}>
        {lang === 'ro' ? 'Scor de sănătate' : 'Health Score'}
      </div>

      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 1rem' }}>
        <svg viewBox="0 0 120 120" width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="54"
            fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="60" cy="60" r="54"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: '2.2rem', fontWeight: 400,
            color: getColor(), lineHeight: 1,
          }}>{score}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '2px' }}>/100</div>
        </div>
      </div>

      <div style={{
        display: 'inline-block',
        background: getColor() + '20',
        color: getColor(),
        borderRadius: '100px',
        padding: '0.3rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: '0.75rem',
      }}>
        {getLabel()}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.5rem', marginTop: '0.75rem',
      }}>
        {[
          { label: lang === 'ro' ? 'Zile libere' : 'Free days', value: Math.round(Math.min(60, (score * 0.6))) },
          { label: lang === 'ro' ? 'Jurnal' : 'Journal', value: Math.round(Math.min(20, (score * 0.2))) },
          { label: lang === 'ro' ? 'Săptămâna' : 'This week', value: Math.round(Math.min(20, (score * 0.2))) },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'var(--surface2)',
            borderRadius: '8px',
            padding: '0.5rem',
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '1px' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

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

  // Health Score 0-100
  const daysScore = Math.min(60, Math.round((days / 90) * 60))
  const journalScore = Math.min(20, journalCount * 2)
  const weekScore = Math.min(20, Math.round((Math.min(days, 7) / 7) * 20))
  const healthScore = started ? daysScore + journalScore + weekScore : 0

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
            <HealthScore score={healthScore} lang={lang} />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--accent)' }}>{days}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.5px', marginTop: '0.25rem' }}>{tr.daysLabel}</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--accent)' }}>{journalCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.5px', marginTop: '0.25rem' }}>{tr.journalLabel}</div>
              </div>
            </div>

            {/* Last 7 days */}
            <div className="card" style={{ marginBottom: '1rem' }}>
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
                  marginBottom: '0.5rem',
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
