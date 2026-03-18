'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => { localStorage.setItem('nobet_lang', lang) }, [lang])

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
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* HERO */}
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
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 400, lineHeight: 1.2,
              color: 'var(--text)', marginBottom: '1.25rem',
            }}>
              {lang === 'ro'
                ? <>Dacă ai ajuns aici,<br />probabil știi deja că<br />ceva trebuie să se schimbe.</>
                : <>If you're here,<br />you probably already know<br />something needs to change.</>}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '0.5rem' }}>
              {lang === 'ro' ? 'Nu ești aici pentru scuze. Ești aici pentru soluții.' : "You're not here for excuses. You're here for solutions."}
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
              {lang === 'ro' ? 'Iar noi suntem aici să te ajutăm să le găsești.' : "And we're here to help you find them."}
            </p>
            <button className="btn-primary" style={{ maxWidth: 220, marginBottom: '0.75rem' }}
              onClick={() => router.push('/contor')}>
              {lang === 'ro' ? 'Începe acum' : 'Start now'}
            </button>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
              {lang === 'ro' ? 'Gratuit. Fără cont.' : 'Free. No account needed.'}
            </div>
          </div>

          {/* Right — SVG */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 400 }}>
              <circle cx="210" cy="190" r="165" fill="#fdf0e8" />
              <rect x="110" y="80" width="200" height="180" rx="12" fill="white" stroke="#f5d5bb" strokeWidth="1.5"/>
              <rect x="110" y="80" width="200" height="40" rx="12" fill="#c95f1a"/>
              <rect x="110" y="108" width="200" height="12" fill="#c95f1a"/>
              <text x="210" y="107" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fill="white">
                {new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
              </text>
              {['L','M','M','J','V','S','D'].map((d, col) => (
                <text key={col} x={127 + col * 27} y="140" textAnchor="middle" fontSize="9" fill="#a0a0a0" fontFamily="Inter, sans-serif">{d}</text>
              ))}
              {Array.from({length: 21}, (_, i) => {
                const row = Math.floor(i / 7), col = i % 7
                const x = 127 + col * 27, y = 162 + row * 27
                return i < 12 ? (
                  <g key={i}>
                    <circle cx={x} cy={y} r="10" fill="#c95f1a" opacity="0.15"/>
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="#c95f1a">✓</text>
                  </g>
                ) : (
                  <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="#d0d0d0" fontFamily="Inter, sans-serif">{i + 1}</text>
                )
              })}
              <rect x="270" y="200" width="100" height="70" rx="12" fill="#c95f1a"/>
              <text x="320" y="228" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="28" fill="white">12</text>
              <text x="320" y="262" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fill="rgba(255,255,255,0.6)" letterSpacing="1">
                {lang === 'ro' ? 'ZILE LIBERE' : 'FREE DAYS'}
              </text>
              <circle cx="90" cy="150" r="18" fill="white" stroke="#f5d5bb" strokeWidth="1.5"/>
              <text x="90" y="155" textAnchor="middle" fontSize="14">📈</text>
              <circle cx="340" cy="120" r="18" fill="white" stroke="#f5d5bb" strokeWidth="1.5"/>
              <text x="340" y="125" textAnchor="middle" fontSize="14">💬</text>
              <circle cx="80" cy="270" r="18" fill="white" stroke="#f5d5bb" strokeWidth="1.5"/>
              <text x="80" y="275" textAnchor="middle" fontSize="14">📓</text>
              <circle cx="350" cy="290" r="18" fill="white" stroke="#f5d5bb" strokeWidth="1.5"/>
              <text x="350" y="295" textAnchor="middle" fontSize="14">🎯</text>
              <rect x="130" y="295" width="160" height="8" rx="4" fill="#fdf0e8"/>
              <rect x="130" y="295" width="96" height="8" rx="4" fill="#c95f1a"/>
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 2.5rem' }} />

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', paddingBottom: '3rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
    </>
  )
}
