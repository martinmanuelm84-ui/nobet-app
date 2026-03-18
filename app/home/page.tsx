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

  const features = lang === 'ro' ? [
    'Monitorizare zilnică a progresului',
    'Antrenor personal gata să te ajute',
    'Jurnal privat pentru momentele dificile',
    'Ghid practic bazat pe experiență reală',
  ] : [
    'Daily progress tracking',
    'Personal coach ready to help',
    'Private journal for difficult moments',
    'Practical guide based on real experience',
  ]

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />

      {!startDate ? (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* HERO — two columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            minHeight: 'calc(80vh - 56px)',
            paddingTop: '2rem',
          }}>
            {/* Left */}
            <div>
              <h1 style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: 'var(--text)',
                marginBottom: '1.25rem',
              }}>
                {lang === 'ro'
                  ? <>Dacă ai ajuns aici,<br />probabil știi deja că<br />ceva trebuie să se schimbe.</>
                  : <>If you're here,<br />you probably already know<br />something needs to change.</>}
              </h1>

              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '0.625rem' }}>
                {lang === 'ro'
                  ? 'Nu ești aici pentru scuze. Ești aici pentru soluții.'
                  : "You're not here for excuses. You're here for solutions."}
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
                {lang === 'ro'
                  ? 'Iar noi suntem aici să te ajutăm să le găsești.'
                  : "And we're here to help you find them."}
              </p>

              <button
                className="btn-primary"
                style={{ maxWidth: 220, marginBottom: '0.75rem' }}
                onClick={handleStart}
              >
                {lang === 'ro' ? 'Începe acum' : 'Start now'}
              </button>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                {lang === 'ro' ? 'Gratuit. Fără cont.' : 'Free. No account needed.'}
              </div>
            </div>

            {/* Right — SVG illustration */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', maxWidth: 400 }}>

                {/* Background circle */}
                <circle cx="210" cy="190" r="165" fill="#eaf5ee" />

                {/* Calendar */}
                <rect x="110" y="80" width="200" height="180" rx="12" fill="white" stroke="#c8e6d4" strokeWidth="1.5"/>
                {/* Calendar header */}
                <rect x="110" y="80" width="200" height="40" rx="12" fill="#2a7a4b"/>
                <rect x="110" y="108" width="200" height="12" rx="0" fill="#2a7a4b"/>
                <text x="210" y="107" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="14" fill="white" fontWeight="400">
                  {new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { month: 'long', year: 'numeric' })}
                </text>

                {/* Calendar grid */}
                {[0,1,2,3,4,5,6].map(col => (
                  <text key={col} x={127 + col * 27} y="140" textAnchor="middle" fontSize="9" fill="#a0a0a0" fontFamily="Inter, sans-serif">
                    {['L','M','M','J','V','S','D'][col]}
                  </text>
                ))}

                {/* Days with checkmarks */}
                {Array.from({length: 21}, (_, i) => {
                  const row = Math.floor(i / 7)
                  const col = i % 7
                  const x = 127 + col * 27
                  const y = 162 + row * 27
                  const checked = i < 12
                  return (
                    <g key={i}>
                      {checked ? (
                        <>
                          <circle cx={x} cy={y} r="10" fill="#2a7a4b" opacity="0.15"/>
                          <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="#2a7a4b">✓</text>
                        </>
                      ) : (
                        <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="#d0d0d0" fontFamily="Inter, sans-serif">
                          {i + 1}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Counter badge */}
                <rect x="270" y="200" width="100" height="70" rx="12" fill="#2a7a4b" />
                <text x="320" y="228" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="28" fill="white">12</text>
                <text x="320" y="248" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)" letterSpacing="1">
                  {lang === 'ro' ? 'ZILE' : 'DAYS'}
                </text>
                <text x="320" y="262" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fill="rgba(255,255,255,0.5)" letterSpacing="0.5">
                  {lang === 'ro' ? 'fără joc' : 'free'}
                </text>

                {/* Floating elements */}
                <circle cx="90" cy="150" r="18" fill="white" stroke="#c8e6d4" strokeWidth="1.5"/>
                <text x="90" y="155" textAnchor="middle" fontSize="14">📈</text>

                <circle cx="340" cy="120" r="18" fill="white" stroke="#c8e6d4" strokeWidth="1.5"/>
                <text x="340" y="125" textAnchor="middle" fontSize="14">💬</text>

                <circle cx="80" cy="270" r="18" fill="white" stroke="#c8e6d4" strokeWidth="1.5"/>
                <text x="80" y="275" textAnchor="middle" fontSize="14">📓</text>

                <circle cx="350" cy="290" r="18" fill="white" stroke="#c8e6d4" strokeWidth="1.5"/>
                <text x="350" y="295" textAnchor="middle" fontSize="14">🎯</text>

                {/* Progress bar bottom */}
                <rect x="130" y="295" width="160" height="8" rx="4" fill="#e8f5ee"/>
                <rect x="130" y="295" width="96" height="8" rx="4" fill="#2a7a4b"/>
                <text x="210" y="322" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#a0a0a0">
                  {lang === 'ro' ? '12 din 30 zile' : '12 of 30 days'}
                </text>
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0 0 2.5rem' }} />

          {/* Features — 4 checkmarks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            paddingBottom: '3rem',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.92rem', color: 'var(--text2)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

      ) : (
        /* ── ACTIVE STATE ── */
        <div className="page">
          <div style={{ paddingTop: '1rem' }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '0.875rem',
            }}>
              {lang === 'ro' ? 'Zile fără jocuri de noroc' : 'Days free from gambling'}
            </div>
            <div style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(5rem, 20vw, 7.5rem)',
              fontWeight: 400, color: 'var(--accent)',
              lineHeight: 1, marginBottom: '0.5rem',
            }}>{days}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '2.5rem' }}>
              {tr.sinceLabel} {new Date(startDate).toLocaleDateString(
                lang === 'ro' ? 'ro-RO' : 'en-GB',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </div>

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
                    position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
                  }}>
                    {!reached && (
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${pct}%`, background: 'var(--accent-light)', transition: 'width 0.5s',
                      }} />
                    )}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 28, color: reached ? 'rgba(255,255,255,0.6)' : 'var(--text3)' }}>
                        {reached ? '✓' : m >= 365 ? '365' : m}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: reached ? '#fff' : 'var(--text2)', fontWeight: reached ? 500 : 400 }}>
                        {milestoneLabels[i]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <button className="btn-secondary" onClick={handleReset}>{tr.resetBtn}</button>
          </div>
        </div>
      )}
    </>
  )
}
