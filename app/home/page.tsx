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
    const saved = localStorage.getItem('nobet_start')
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
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
          /* ── STARE INIȚIALĂ ── */
          <div style={{ paddingTop: '3rem' }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '2.5px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '1.25rem'
            }}>NoBet</div>

            <h1 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(2rem, 6vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--text)',
              marginBottom: '1.5rem',
              maxWidth: 420,
            }}>
              {lang === 'ro'
                ? 'Poate te putem ajuta.'
                : 'We might be able to help.'}
            </h1>

            <p style={{
              fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7,
              maxWidth: 400, marginBottom: '2.5rem'
            }}>
              {lang === 'ro'
                ? 'Nu e o aplicație care să îți explice că ai o problemă. Știi asta deja. E un instrument simplu pentru zilele în care ai nevoie de ceva concret.'
                : "This isn't an app that explains you have a problem. You already know that. It's a simple tool for the days when you need something concrete."}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem', maxWidth: 400 }}>
              {[
                { icon: '◎', text: lang === 'ro' ? 'Contor de zile — simplu și clar' : 'Day counter — simple and clear' },
                { icon: '◈', text: lang === 'ro' ? 'Companion AI disponibil oricând' : 'AI Companion available anytime' },
                { icon: '◻', text: lang === 'ro' ? 'Jurnal privat, doar al tău' : 'Private journal, yours alone' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ color: 'var(--text3)', fontSize: '1rem', width: 20, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ maxWidth: 400 }} onClick={handleStart}>
              {tr.startBtn}
            </button>
          </div>

        ) : (
          /* ── STARE ACTIVĂ ── */
          <div style={{ paddingTop: '2rem' }}>
            {/* Counter */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                fontSize: '0.7rem', letterSpacing: '2.5px', textTransform: 'uppercase',
                color: 'var(--text3)', marginBottom: '1rem'
              }}>
                {lang === 'ro' ? 'Zile fără jocuri de noroc' : 'Days free from gambling'}
              </div>
              <div style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(4.5rem, 18vw, 7rem)',
                fontWeight: 400,
                color: 'var(--anthracite)',
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
              color: 'var(--text3)', marginBottom: '0.875rem'
            }}>{tr.milestones}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {MILESTONES.map((m, i) => {
                const reached = days >= m
                const pct = Math.min(100, (days / m) * 100)
                return (
                  <div key={m} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.875rem 1rem',
                    background: reached ? 'var(--anthracite)' : 'var(--surface)',
                    border: `1px solid ${reached ? 'var(--anthracite)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {!reached && (
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${pct}%`, background: 'var(--surface2)',
                        transition: 'width 0.5s',
                      }} />
                    )}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        color: reached ? 'rgba(255,255,255,0.5)' : 'var(--text3)',
                        minWidth: 28,
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
