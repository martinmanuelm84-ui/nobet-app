'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 7, 30, 90, 365]

function Tree({ days }: { days: number }) {
  // 0 zile = doar trunchi, 365+ = copac complet
  const progress = Math.min(1, days / 90) // plin la 90 zile
  const leaves = Math.floor(progress * 24)

  const leafPositions = [
    // coroana - poziții fixe pentru 24 frunze
    [200,140],[230,120],[260,140],[280,160],[260,110],[230,95],[200,110],[170,120],
    [150,145],[160,165],[180,105],[250,105],[270,130],[245,155],[215,155],[185,145],
    [165,135],[195,125],[225,115],[255,125],[240,145],[210,140],[180,130],[205,155],
  ]

  return (
    <svg viewBox="0 0 400 320" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block' }}>
      {/* Pământ */}
      <ellipse cx="200" cy="300" rx="80" ry="10" fill="rgba(0,0,0,0.08)" />

      {/* Trunchi */}
      <path d="M185,295 C183,260 180,230 185,200 C188,180 192,165 200,155 C208,165 212,180 215,200 C220,230 217,260 215,295 Z"
        fill="#8B6340" />

      {/* Rădăcini */}
      <path d="M190,290 C175,295 160,292 150,298" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M210,290 C225,295 240,292 250,298" stroke="#8B6340" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Frunze - apar progresiv */}
      {leafPositions.slice(0, leaves).map(([cx, cy], i) => {
        const size = 14 + Math.random() * 8
        const opacity = 0.7 + (i / 24) * 0.3
        const green = i < 8 ? '#4ade80' : i < 16 ? '#22c55e' : '#16a34a'
        return (
          <ellipse key={i} cx={cx} cy={cy}
            rx={size} ry={size * 0.75}
            fill={green}
            opacity={opacity}
            style={{ transition: 'all 0.5s ease' }}
          />
        )
      })}

      {/* Contur coroană dacă are cel puțin câteva frunze */}
      {leaves > 4 && (
        <ellipse cx="210" cy="140" rx="70" ry="55"
          fill="none" stroke="rgba(74,222,128,0.15)" strokeWidth="2" />
      )}
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
      // La recădere — păstrăm 30% din zile, nu resetăm la zero
      const savedDays = Math.floor(days * 0.3)
      const newStart = new Date(Date.now() - savedDays * 86400000).toISOString().split('T')[0]
      localStorage.setItem('nobet_start', newStart)
      setStartDate(newStart)
      calcDays(newStart)
    }
  }

  const milestoneLabels = [tr.mDay, tr.m7, tr.m30, tr.m90, tr.m365]

  // Mesaj motivațional în funcție de zile
  const getMessage = () => {
    if (days === 0) return lang === 'ro' ? 'Copacul tău te așteaptă.' : 'Your tree is waiting.'
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
            <h1 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem', fontWeight: 400,
              color: 'var(--text)', marginBottom: '0.75rem',
            }}>
              {lang === 'ro' ? 'Ziua unu începe azi.' : 'Day one starts today.'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {lang === 'ro'
                ? 'Apasă butonul și copacul tău începe să crească.'
                : 'Press the button and your tree starts to grow.'}
            </p>
            <Tree days={0} />
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleStart}>
              {lang === 'ro' ? 'Încep de azi' : 'I start today'}
            </button>
          </div>
        ) : (
          <div style={{ paddingTop: '1.5rem', textAlign: 'center' }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '0.5rem',
            }}>
              {lang === 'ro' ? 'Ziua' : 'Day'}
            </div>
            <div style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(4rem, 18vw, 6rem)',
              fontWeight: 400, color: 'var(--accent)',
              lineHeight: 1, marginBottom: '0.25rem',
            }}>{days}</div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text3)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
              {getMessage()}
            </div>

            <Tree days={days} />

            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', margin: '0.5rem 0 2rem' }}>
              {tr.sinceLabel} {new Date(startDate!).toLocaleDateString(
                lang === 'ro' ? 'ro-RO' : 'en-GB',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )}
            </div>

            <div style={{
              fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '0.875rem', textAlign: 'left',
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
                    borderRadius: '8px', position: 'relative', overflow: 'hidden',
                  }}>
                    {!reached && <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${pct}%`, background: 'var(--accent-light)',
                    }} />}
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
