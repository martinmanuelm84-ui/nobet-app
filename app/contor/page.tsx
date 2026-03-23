'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 3, 7, 30, 90, 365]

function Tree({ days }: { days: number }) {
  const progress = Math.min(1, days / 90)
  // Minim 1 frunză mereu, maxim 20
  const leaves = Math.max(1, Math.floor(progress * 20))

  // 20 poziții fixe pe ramuri
  const leafPositions = [
    // ramura stânga sus
    [148, 118], [125, 105], [138, 92],
    // ramura dreapta sus
    [252, 118], [275, 105], [262, 92],
    // ramura stânga mijloc
    [130, 160], [108, 148], [120, 135],
    // ramura dreapta mijloc
    [270, 160], [292, 148], [280, 135],
    // ramura stânga jos
    [118, 200], [96, 192],
    // ramura dreapta jos
    [282, 200], [304, 192],
    // vârf
    [200, 78], [186, 88], [214, 88],
    // centru coroană
    [200, 110],
  ]

  return (
    <svg viewBox="0 0 400 320" style={{ width: '100%', maxWidth: 320, margin: '0 auto', display: 'block' }}>
      {/* Umbra */}
      <ellipse cx="200" cy="305" rx="70" ry="8" fill="rgba(0,0,0,0.07)" />

      {/* Trunchi */}
      <path d="M188,300 C186,270 184,240 186,215 C188,195 194,178 200,168 C206,178 212,195 214,215 C216,240 214,270 212,300 Z"
        fill="#8B6340" />

      {/* Rădăcini */}
      <path d="M192,295 C180,298 165,296 155,302" stroke="#7a5530" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M208,295 C220,298 235,296 245,302" stroke="#7a5530" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Ramura stânga sus */}
      <path d="M196,180 C185,170 165,155 145,120" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Ramura dreapta sus */}
      <path d="M204,180 C215,170 235,155 255,120" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Ramura stânga mijloc */}
      <path d="M193,205 C178,198 155,188 125,155" stroke="#8B6340" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Ramura dreapta mijloc */}
      <path d="M207,205 C222,198 245,188 275,155" stroke="#8B6340" strokeWidth="4" fill="none" strokeLinecap="round"/>

      {/* Ramura stânga jos */}
      <path d="M190,225 C172,220 148,212 112,195" stroke="#8B6340" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Ramura dreapta jos */}
      <path d="M210,225 C228,220 252,212 288,195" stroke="#8B6340" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* Ramura vârf */}
      <path d="M200,168 C200,145 200,115 200,82" stroke="#8B6340" strokeWidth="4" fill="none" strokeLinecap="round"/>

      {/* Frunze */}
      {leafPositions.slice(0, leaves).map(([cx, cy], i) => {
        const size = 13 + (i % 3) * 3
        const green = i === 0 ? '#4ade80' : i < 6 ? '#22c55e' : '#16a34a'
        return (
          <ellipse key={i}
            cx={cx} cy={cy}
            rx={size} ry={size * 0.72}
            fill={green}
            opacity={0.85}
          />
        )
      })}
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
      // Păstrează minim 1 zi (1 frunză rămâne mereu)
      const savedDays = Math.max(1, Math.floor(days * 0.15))
      const newStart = new Date(Date.now() - savedDays * 86400000).toISOString().split('T')[0]
      localStorage.setItem('nobet_start', newStart)
      setStartDate(newStart)
      calcDays(newStart)
    }
  }

  const milestoneLabels = [tr.mDay, tr.m3 ?? (lang === 'ro' ? '3 zile — primele semne.' : '3 days — first signs.'), tr.m7, tr.m30, tr.m90, tr.m365]

  const getMessage = () => {
    if (days <= 1) return lang === 'ro' ? 'Prima frunză — primul pas.' : 'First leaf — first step.'
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
