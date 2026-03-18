'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

const MILESTONES = [1, 7, 30, 90, 365]

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
      localStorage.removeItem('nobet_start')
      setStartDate(null)
      setStarted(false)
      setDays(0)
    }
  }

  const milestoneLabels = [tr.mDay, tr.m7, tr.m30, tr.m90, tr.m365]

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page">
        {!started ? (
          /* Nu a început încă — buton direct, fără zero */
          <div style={{ paddingTop: '3rem', maxWidth: 420 }}>
            <h1 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: '2rem', fontWeight: 400,
              color: 'var(--text)', marginBottom: '0.75rem',
            }}>
              {lang === 'ro' ? 'Ziua unu începe azi.' : 'Day one starts today.'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {lang === 'ro'
                ? 'Apasă butonul și contorul pornește de azi.'
                : 'Press the button and the counter starts from today.'}
            </p>
            <button className="btn-primary" onClick={handleStart}>
              {lang === 'ro' ? 'Încep de azi' : 'I start today'}
            </button>
          </div>
        ) : (
          /* Activ */
          <div style={{ paddingTop: '1.5rem' }}>
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
              {tr.sinceLabel} {new Date(startDate!).toLocaleDateString(
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
            <button className="btn-secondary" onClick={handleReset}>{tr.resetBtn}</button>
          </div>
        )}
      </div>
    </>
  )
}
