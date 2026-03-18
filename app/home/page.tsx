'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 7, 30, 90, 365]

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [days, setDays] = useState(0)
  const tr = t[lang].home

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    const saved = localStorage.getItem('nobet_start')
    if (saved) { setStartDate(saved); calcDays(saved) }
  }, [])

  useEffect(() => { localStorage.setItem('nobet_lang', lang) }, [lang])

  function calcDays(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
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
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page">
        {!startDate ? (
          <div style={{ paddingTop: '2.5rem' }}>
            {/* Hero text */}
            <h1 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.25,
              color: 'var(--text)',
              marginBottom: '1.5rem',
              maxWidth: 460,
            }}>
              {lang === 'ro'
                ? 'Dacă ai ajuns aici, probabil știi deja că ceva trebuie să se schimbe.'
                : "If you're here, you probably already know something needs to change."}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', maxWidth: 460 }}>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                {lang === 'ro'
                  ? 'Nu ești aici pentru scuze. Ești aici pentru soluții.'
                  : "You're not here for excuses. You're here for solutions."}
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                {lang === 'ro'
                  ? 'Iar noi suntem aici să te ajutăm să le găsești.'
                  : "And we're here to help you find them."}
              </p>
            </div>

            {/* What you get */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2.5rem', maxWidth: 420 }}>
              {(lang === 'ro' ? [
                'Contor de zile — simplu și clar',
                'Antrenor AI disponibil oricând',
                'Jurnal privat, doar al tău',
                'Ghid practic bazat pe experiență reală',
              ] : [
                'Day counter — simple and clear',
                'AI Coach available anytime',
                'Private journal, yours alone',
                'Practical guide based on real experience',
              ]).map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{item}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ maxWidth: 420 }} onClick={handleStart}>
              {tr.startBtn}
            </button>
          </div>

        ) : (
          <div style={{ paddingTop: '2rem' }}>
            {/* Counter */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--text3)', marginBottom: '0.875rem',
              }}>
                {lang === 'ro' ? 'Zile fără jocuri de noroc' : 'Days free from gambling'}
              </div>
              <div style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(5rem, 20vw, 7.5rem)',
                fontWeight: 400,
                color: 'var(--accent)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>{days}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                {tr.sinceLabel} {new Date(startDate).toLocaleDateString(
                  lang === 'ro' ? 'ro-RO' : 'en-GB',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </div>
            </div>

            {/* Milestones */}
            <div style={{
              fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '0.875rem',
            }}>{tr.milestones}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {MILESTONES.map((m, i) => {
                const reached = days >= m
                const pct = Math.min(100, (days / m) * 100)
                return (
                  <div key={m} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1rem',
                    background: reached ? 'var(--accent)' : 'var(--surface)',
                    border: `1px solid ${reached ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}>
                    {!reached && (
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${pct}%`, background: 'var(--accent-light)',
                        transition: 'width 0.5s',
                      }} />
                    )}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, minWidth: 28,
                        color: reached ? 'rgba(255,255,255,0.6)' : 'var(--text3)',
                      }}>{reached ? '✓' : m >= 365 ? '365' : m}</span>
                      <span style={{
                        fontSize: '0.88rem',
                        color: reached ? '#fff' : 'var(--text2)',
                        fontWeight: reached ? 500 : 400,
                      }}>{milestoneLabels[i]}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="btn-secondary" onClick={handleReset}>{tr.resetBtn}</button>
          </div>
        )}
      </div>
    </>
  )
}
