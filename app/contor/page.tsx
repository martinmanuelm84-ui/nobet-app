'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 3, 7, 30, 90, 365]

function Tree({ days }: { days: number }) {
  const progress = Math.min(1, days / 90)
  const leaves = Math.max(1, Math.floor(progress * 24))

  // Pozițiile frunzelor distribuite pe toată coroana copacului
  const leafPositions: [number, number, number][] = [
    // vârf
    [50, 18, 7],
    // coroana sus
    [42, 22, 6], [58, 22, 6],
    [35, 28, 7], [50, 25, 6], [65, 28, 7],
    // coroana mijloc
    [28, 36, 7], [40, 32, 6], [50, 30, 6], [60, 32, 6], [72, 36, 7],
    // coroana jos stânga
    [22, 44, 6], [32, 40, 6], [42, 38, 5],
    // coroana jos dreapta
    [58, 38, 5], [68, 40, 6], [78, 44, 6],
    // ramuri laterale jos
    [18, 52, 6], [30, 48, 5], [70, 48, 5], [82, 52, 6],
    // câteva în interior
    [45, 35, 5], [55, 35, 5], [50, 42, 5],
  ]

  const getColor = (i: number) => {
    if (i === 0) return '#86efac'
    if (i < 3) return '#4ade80'
    if (i < 10) return '#22c55e'
    if (i < 18) return '#16a34a'
    return '#15803d'
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 300, margin: '0 auto' }}>
      {/* Imaginea copacului gol */}
      <img
        src="/tree-bare.png"
        alt="copac"
        style={{ width: '100%', display: 'block' }}
      />
      {/* Frunze SVG suprapuse */}
      <svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {leafPositions.slice(0, leaves).map(([cx, cy, r], i) => (
          <g key={i}>
            <ellipse
              cx={cx} cy={cy}
              rx={r} ry={r * 0.75}
              fill={getColor(i)}
              opacity={0.88}
            />
            <ellipse
              cx={cx} cy={cy}
              rx={r * 0.45} ry={r * 0.3}
              fill="rgba(255,255,255,0.2)"
            />
          </g>
        ))}
      </svg>
    </div>
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
