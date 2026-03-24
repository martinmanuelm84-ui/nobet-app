'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 3, 7, 30, 90, 365]

function Tree({ days }: { days: number }) {
  const progress = Math.min(1, days / 90)
  const leaves = Math.max(1, Math.floor(progress * 28))

  const leafPositions: [number, number, number][] = [
    [200, 62, 11], [185, 72, 10], [215, 72, 10],
    [170, 85, 10], [200, 80, 9], [230, 85, 10],
    [152, 100, 10], [168, 92, 9], [215, 92, 9], [248, 100, 10],
    [138, 118, 10], [155, 108, 9], [175, 102, 8], [225, 102, 8], [245, 108, 9], [262, 118, 10],
    [122, 138, 9], [140, 128, 8], [160, 118, 8], [240, 118, 8], [260, 128, 8], [278, 138, 9],
    [108, 158, 9], [128, 146, 8], [272, 146, 8], [292, 158, 9],
    [96, 178, 8], [304, 178, 8],
  ]

  const getColor = (i: number) => {
    if (i === 0) return '#86efac'
    if (i < 4) return '#4ade80'
    if (i < 12) return '#22c55e'
    if (i < 20) return '#16a34a'
    return '#15803d'
  }

  return (
    <svg viewBox="0 0 400 340" style={{ width: '100%', maxWidth: 320, margin: '0 auto', display: 'block' }}>
      {/* Umbra */}
      <ellipse cx="200" cy="328" rx="72" ry="8" fill="rgba(0,0,0,0.07)" />

      {/* Trunchi */}
      <path d="M186,320 C184,295 182,268 183,245 C184,228 188,212 192,198 C195,186 198,175 200,168 C202,175 205,186 208,198 C212,212 216,228 217,245 C218,268 216,295 214,320 Z" fill="#8B6340"/>
      <path d="M192,320 C190,295 189,268 190,245 C191,230 194,215 197,202 C198,193 199,182 200,175 C201,182 202,193 203,202 C206,215 209,230 210,245 C211,268 210,295 208,320 Z" fill="#a87848"/>

      {/* Rădăcini */}
      <path d="M189,315 C178,318 162,316 148,322" stroke="#8B6340" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M211,315 C222,318 238,316 252,322" stroke="#8B6340" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M193,318 C187,322 178,326 168,328" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M207,318 C213,322 222,326 232,328" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Ramura centrală vârf */}
      <path d="M200,168 C200,148 200,128 200,68" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Ramuri principale stânga */}
      <path d="M196,185 C182,172 162,155 138,122" stroke="#8B6340" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <path d="M193,205 C175,192 152,178 122,148" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M190,225 C168,214 142,202 108,172" stroke="#8B6340" strokeWidth="4.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri principale dreapta */}
      <path d="M204,185 C218,172 238,155 262,122" stroke="#8B6340" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      <path d="M207,205 C225,192 248,178 278,148" stroke="#8B6340" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M210,225 C232,214 258,202 292,172" stroke="#8B6340" strokeWidth="4.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri secundare stânga sus */}
      <path d="M172,148 C162,136 152,122 145,105" stroke="#8B6340" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M155,132 C145,120 138,106 132,90" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M142,120 C132,108 124,94 118,78" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri secundare dreapta sus */}
      <path d="M228,148 C238,136 248,122 255,105" stroke="#8B6340" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M245,132 C255,120 262,106 268,90" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M258,120 C268,108 276,94 282,78" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri secundare stânga mijloc */}
      <path d="M148,168 C135,158 120,148 105,135" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M128,155 C115,145 102,134 90,120" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Ramuri secundare dreapta mijloc */}
      <path d="M252,168 C265,158 280,148 295,135" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M272,155 C285,145 298,134 310,120" stroke="#8B6340" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Ramurele fine vârf */}
      <path d="M200,90 C193,80 186,70 180,58" stroke="#8B6340" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M200,90 C207,80 214,70 220,58" stroke="#8B6340" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M200,108 C188,96 178,85 168,72" stroke="#8B6340" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M200,108 C212,96 222,85 232,72" stroke="#8B6340" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Frunze */}
      {leafPositions.slice(0, leaves).map(([cx, cy, r], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.72} fill={getColor(i)} opacity={0.9}/>
          <ellipse cx={cx - r * 0.15} cy={cy - r * 0.1} rx={r * 0.4} ry={r * 0.25} fill="rgba(255,255,255,0.18)"/>
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
    tr.m7, tr.m30, tr.m90, tr.m365,
  ]

  const getMessage = () => {
    if (days <= 1) return lang === 'ro' ? 'Prima frunză — primul pas.' : 'First leaf — first step.'
    if (days < 3) return lang === 'ro' ? 'A doua zi — cel mai greu moment.' : 'Day two — the hardest moment.'
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
