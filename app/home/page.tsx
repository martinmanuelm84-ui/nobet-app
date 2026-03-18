'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 7, 30, 90, 365]

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [days, setDays] = useState(0)
  const [motIdx, setMotIdx] = useState(0)
  const tr = t[lang].home

  useEffect(() => {
    const saved = localStorage.getItem('nobet_start')
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    if (saved) {
      setStartDate(saved)
      calcDays(saved)
    }
    setMotIdx(Math.floor(Math.random() * t[lang].home.motivations.length))
  }, [])

  useEffect(() => {
    localStorage.setItem('nobet_lang', lang)
  }, [lang])

  function calcDays(date: string) {
    const start = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setDays(Math.max(0, diff))
  }

  function handleStart() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('nobet_start', today)
    setStartDate(today)
    calcDays(today)
  }

  function handleReset() {
    if (confirm(tr.resetConfirm)) {
      localStorage.removeItem('nobet_start')
      setStartDate(null)
      setDays(0)
    }
  }

  const milestoneLabels = [tr.mDay, tr.m7, tr.m30, tr.m90, tr.m365]

  return (
    <>
      <div className="page">
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--accent)', fontWeight: 500 }}>NoBet</div>
          <div className="lang-switch">
            <button className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')}>RO</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        {/* Counter */}
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', marginBottom: '1rem' }}>
          {startDate ? (
            <>
              <div style={{
                fontSize: 'clamp(4rem, 20vw, 6rem)',
                fontWeight: 300,
                color: 'var(--accent)',
                lineHeight: 1,
                fontFamily: 'Playfair Display, serif',
                marginBottom: '0.5rem',
              }}>{days}</div>
              <div style={{ fontSize: '1rem', color: 'var(--text2)', marginBottom: '0.25rem' }}>
                {days === 1 ? tr.dayLabel : tr.daysLabel}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.5rem' }}>
                {tr.sinceLabel} {new Date(startDate).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
              <div style={{ fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>{tr.tagline}</div>
            </>
          )}
        </div>

        {/* Motivation */}
        {startDate && (
          <div className="card" style={{ background: 'var(--accent-light)', border: '1px solid #c3e6d0', marginBottom: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', lineHeight: 1.6 }}>
              {tr.motivations[motIdx % tr.motivations.length]}
            </div>
          </div>
        )}

        {/* CTA */}
        {!startDate ? (
          <button className="btn-primary" onClick={handleStart}>{tr.startBtn}</button>
        ) : (
          <button className="btn-secondary" onClick={handleReset}>{tr.resetBtn}</button>
        )}

        {/* Milestones */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {tr.milestones}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {MILESTONES.map((m, i) => {
              const reached = days >= m
              return (
                <div key={m} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  background: reached ? 'var(--accent-light)' : 'var(--surface)',
                  border: `1px solid ${reached ? '#c3e6d0' : 'var(--border)'}`,
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: reached ? 'var(--accent)' : 'var(--surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', color: reached ? '#fff' : 'var(--text3)',
                    flexShrink: 0,
                  }}>
                    {reached ? '✓' : m >= 365 ? '★' : m}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: reached ? 'var(--accent)' : 'var(--text2)' }}>
                    {milestoneLabels[i]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Nav lang={lang} onLangChange={setLang} />
    </>
  )
}
