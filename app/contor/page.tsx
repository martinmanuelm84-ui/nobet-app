'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 3, 7, 30, 90, 365]

function Tree({ days }: { days: number }) {
  const progress = Math.min(1, days / 90)
  const leaves = Math.max(1, Math.floor(progress * 22))

  const leafPositions: [number, number, number][] = [
    [200, 72, 16], [182, 84, 14], [218, 84, 14],
    [155, 108, 15], [165, 92, 13], [245, 108, 15], [235, 92, 13],
    [135, 148, 14], [148, 132, 13], [265, 148, 14], [252, 132, 13],
    [118, 188, 13], [132, 172, 12], [282, 188, 13], [268, 172, 12],
    [105, 222, 12], [122, 208, 11], [295, 222, 12], [278, 208, 11],
    [170, 118, 12], [230, 118, 12], [200, 95, 13],
  ]

  const getColor = (i: number) => {
    if (i === 0) return '#86efac'
    if (i < 4) return '#4ade80'
    if (i < 10) return '#22c55e'
    return '#16a34a'
  }

  return (
    <svg viewBox="0 0 400 330" style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}>
      {/* Umbra */}
      <ellipse cx="200" cy="318" rx="65" ry="7" fill="rgba(0,0,0,0.06)" />

      {/* Trunchi — mai lat și organic */}
      <path d="M182,310 C179,280 176,250 178,222 C179,205 184,188 188,175 C192,162 196,155 200,150 C204,155 208,162 212,175 C216,188 221,205 222,222 C224,250 221,280 218,310 Z"
        fill="#9c7040" />
      <path d="M188,310 C186,280 184,250 185,222 C186,208 190,190 194,177 C196,170 198,163 200,158 C202,163 204,170 206,177 C210,190 214,208 215,222 C216,250 214,280 212,310 Z"
        fill="#b8894e" />

      {/* Rădăcini */}
      <path d="M186,305 C175,308 158,306 144,312" stroke="#9c7040" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M214,305 C225,308 242,306 256,312" stroke="#9c7040" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M192,310 C188,314 182,318 172,320" stroke="#9c7040" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M208,310 C212,314 218,318 228,320" stroke="#9c7040" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Ramura vârf */}
      <path d="M200,152 C199,132 198,112 198,80" stroke="#9c7040" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Ramuri stânga sus */}
      <path d="M194,168 C182,158 166,142 148,112" stroke="#9c7040" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M155,122 C148,112 142,100 138,88" stroke="#9c7040" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri dreapta sus */}
      <path d="M206,168 C218,158 234,142 252,112" stroke="#9c7040" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M245,122 C252,112 258,100 262,88" stroke="#9c7040" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri stânga mijloc */}
      <path d="M188,198 C172,188 152,178 128,152" stroke="#9c7040" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M134,162 C124,152 116,140 110,126" stroke="#9c7040" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Ramuri dreapta mijloc */}
      <path d="M212,198 C228,188 248,178 272,152" stroke="#9c7040" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M266,162 C276,152 284,140 290,126" stroke="#9c7040" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Ramuri stânga jos */}
      <path d="M184,222 C165,215 142,208 112,192" stroke="#9c7040" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Ramuri dreapta jos */}
      <path d="M216,222 C235,215 258,208 288,192" stroke="#9c7040" strokeWidth="4" fill="none" strokeLinecap="round"/>

      {/* Frunze */}
      {leafPositions.slice(0, leaves).map(([cx, cy, r], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.78} fill={getColor(i)} opacity={0.9} />
          <ellipse cx={cx} cy={cy} rx={r * 0.5} ry={r * 0.35} fill="rgba(255,255,255,0.15)" />
        </g>
      ))}
    </svg>
  )
}

export default function ContorPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [days, setDays] = useState(0)
  const [started, setStarted] = useState(false)
  const tr = t[lang].home

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    const saved = localStorage.getItem('nobet_start')
    if (saved) {
      setStartDate(saved)
      setStarted(true)
      calcDays(saved)
    }
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
    setStarted(true)
    calcDays(today)
  }

  function handleReset() {
    if (confirm(tr.resetConfirm)) {
      const savedDays = Math.max(1, Math.floor(days * 0.15))
      const newStart = new Date(Date.now() - savedDays * 86400000).toISOString().split('T')[0]
      localStorage.setItem('nobet_start', newStart)
      setStartDate(newStart)
      calcDays(newStart)
    }
  }

  const milestoneLabels = [
    tr.mDay,
    lang === 'ro' ? '3 zile — primele semne.' : '3 days — first signs.',
    tr.m7,
    tr.m30,
    tr.m90,
    tr.m365,
  ]

  const getMessage = () => {
    if (days <= 1) return lang === 'ro' ? 'Prima frunză — primul pas.' : 'First leaf — first step.'
    if (days < 3) return lang === 'ro' ? 'Rădăcinile prind pământ.' : 'Roots are taking hold.'
    if (days < 7) return lang === 'ro' ? 'Primii muguri apar.' : 'First buds are appearing.'
    if (days < 30) return lang === 'ro' ? 'Copacul prinde putere.' : 'The tree is growing stronger.'
    if (days < 90) return lang === 'ro' ? 'Frunzele se înmulțesc.' : 'Leaves are multiplying.'
    return lang === 'ro' ? 'Un copac puternic nu se teme de nicio furtună.' : 'A strong tree fears no storm.'
  }

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page">
        {!started ? (
          <div style={{ paddingTop: '3rem', maxWidth: 420 }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--text)', marginBottom: '0.75rem' }}>
              {lang === 'ro' ? 'Ziua unu începe azi.' : 'Day one starts today.'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {lang === 'ro' ? 'Apasă butonul și copacul tău începe să crească.' : 'Press the button and your tree starts to grow.'}
            </p>
            <Tree days={0} />
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleStart}>
              {lang === 'ro' ? 'Încep de azi' : 'I start today'}
            </button>
          </div>
        ) : (
          <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' }}>
              {lang === 'ro' ? 'Ziua' : 'Day'}
            </div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(4rem, 18vw, 6rem)', fontWeight: 400, color: 'var(--accent)', lineHeight: 1, marginBottom: '0.25rem' }}>
              {days}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text3)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
              {getMessage()}
            </div>

            <Tree days={days} />

            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', margin: '0.5rem 0 2rem' }}>
              {tr.sinceLabel} {new Date(startDate!).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div style={{ fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.875rem', textAlign: 'left' }}>
              {tr.milestones}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {MILESTONES.map((m, i) => {
                const reached = days >= m
                const pct = Math.min(100, (days / m) * 100)
                return (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: reached ? 'var(--accent)' : 'var(--surface)', border: `1px solid ${reached ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    {!reached && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'var(--accent-light)' }} />}
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

            <button className="btn-secondary" onClick={handleReset}>
              {lang === 'ro' ? 'Am jucat — reconfigurează' : 'I played — reconfigure'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
