'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [
  { days: 1, label: { ro: 'Prima zi', en: 'Day one' }, icon: '🌱' },
  { days: 7, label: { ro: '7 zile', en: '7 days' }, icon: '🌿' },
  { days: 30, label: { ro: '30 zile', en: '30 days' }, icon: '🌳' },
  { days: 90, label: { ro: '90 zile', en: '90 days' }, icon: '⭐' },
  { days: 365, label: { ro: '1 an', en: '1 year' }, icon: '🏆' },
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
      const diff = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      setDays(Math.max(0, diff))
    }

    const journal = localStorage.getItem('nobet_journal')
    if (journal) setJournalCount(JSON.parse(journal).length)
  }, [])

  const saved = days * 50

  // Last 7 days representation
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

        {!started ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text3)', fontSize: '0.92rem' }}>
            {tr.notStarted}
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>{days}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem' }}>{tr.daysLabel}</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>
                  {saved >= 1000 ? `${(saved / 1000).toFixed(1)}k` : saved}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem' }}>{tr.savedLabel} (RON)</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: '0.1rem' }}>{tr.savedDesc}</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>{days}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem' }}>{tr.streakLabel}</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>{journalCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem' }}>{tr.journalLabel}</div>
              </div>
            </div>

            {/* Last 7 days */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: '0.5px', marginBottom: '0.875rem' }}>
                {tr.weekLabel}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                {last7.map((day, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
                    <div style={{
                      width: '100%',
                      height: 48,
                      borderRadius: '8px',
                      background: day.free ? 'var(--accent)' : 'var(--surface2)',
                      border: `1px solid ${day.free ? 'transparent' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: day.free ? '#fff' : 'var(--text3)',
                    }}>
                      {day.free ? '✓' : '·'}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {tr.milestonesTitle}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MILESTONES.map((m) => {
                  const reached = days >= m.days
                  const pct = Math.min(100, (days / m.days) * 100)
                  return (
                    <div key={m.days} className="card" style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: reached ? 0 : '0.5rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{reached ? m.icon : '○'}</span>
                        <span style={{ flex: 1, fontSize: '0.88rem', color: reached ? 'var(--accent)' : 'var(--text2)', fontWeight: reached ? 500 : 400 }}>
                          {m.label[lang]}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{m.days}d</span>
                      </div>
                      {!reached && (
                        <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', marginLeft: '2rem' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 0.5s' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <Nav lang={lang} onLangChange={setLang} />
    </>
  )
}
