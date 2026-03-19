'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const GAMES = [
  { icon: '♟️', ro: 'Șah', en: 'Chess', descRo: 'Strategie pură contra calculatorului. Zero noroc.', descEn: 'Pure strategy vs computer. Zero luck.', tag: 'Strategie', href: '/jocuri/sah' },
  { icon: '🔢', ro: 'Sudoku', en: 'Sudoku', descRo: 'Trei dificultăți. Gândire clară, satisfacție reală.', descEn: 'Three levels. Clear thinking, real satisfaction.', tag: 'Logică', href: '/jocuri/sudoku' },
  { icon: '🧩', ro: '2048', en: '2048', descRo: 'Combină numerele. Captivant, fără mize financiare.', descEn: 'Merge numbers. Engaging, no financial stakes.', tag: 'Concentrare', href: '/jocuri/2048' },
]

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => { localStorage.setItem('nobet_lang', lang) }, [lang])

  const features = lang === 'ro' ? [
    { label: 'Monitorizare zilnică', href: '/contor' },
    { label: 'Antrenor personal', href: '/companion' },
    { label: 'Jurnal privat', href: '/journal' },
    { label: 'Ghid practic', href: '/guide' },
  ] : [
    { label: 'Daily tracking', href: '/contor' },
    { label: 'Personal coach', href: '/companion' },
    { label: 'Private journal', href: '/journal' },
    { label: 'Practical guide', href: '/guide' },
  ]

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .hero-section { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; min-height:calc(90vh - 56px); padding:3rem 0 2rem; }
        .hero-h1 { font-family:'Lora','DM Serif Display',serif; font-size:clamp(1.9rem,3.5vw,2.75rem); font-weight:600; line-height:1.2; color:var(--text); margin-bottom:1.5rem; letter-spacing:-0.5px; }
        .hero-h1 em { color:var(--accent); font-style:italic; }
        .hero-lead { font-size:1rem; color:var(--text2); line-height:1.8; margin-bottom:0.5rem; font-weight:300; }
        .hero-btn { display:inline-block; margin-top:2.5rem; padding:1rem 2.25rem; background:var(--accent); color:white; border:none; border-radius:100px; font-size:1rem; font-weight:500; cursor:pointer; font-family:inherit; text-decoration:none; transition:background 0.2s,transform 0.15s; }
        .hero-btn:hover { background:var(--accent-dark); transform:translateY(-1px); }
        .hero-note { display:block; margin-top:0.875rem; font-size:0.82rem; color:var(--text3); font-style:italic; }
        .cal-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:1.75rem; }
        .cal-header { background:var(--accent); color:white; border-radius:10px; padding:0.75rem 1rem; text-align:center; font-weight:500; font-size:0.9rem; margin-bottom:1.25rem; }
        .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; text-align:center; margin-bottom:1rem; }
        .cal-dname { font-size:10px; color:var(--text3); font-weight:500; padding:4px 0; text-transform:uppercase; }
        .cal-day { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; margin:0 auto; color:var(--text2); }
        .cal-day.checked { background:var(--accent-light); color:var(--accent); font-weight:500; }
        .cal-day.empty { color:transparent; }
        .days-badge { background:var(--accent); color:white; border-radius:12px; padding:1.25rem; text-align:center; }
        .days-number { font-family:'Lora','DM Serif Display',serif; font-size:3.25rem; font-weight:600; line-height:1; display:block; }
        .days-label { font-size:0.7rem; opacity:0.8; text-transform:uppercase; letter-spacing:1.5px; margin-top:4px; display:block; }
        .section-label { font-size:0.75rem; font-weight:500; color:var(--accent); text-transform:uppercase; letter-spacing:2px; margin-bottom:0.875rem; }
        .section-title { font-family:'Lora','DM Serif Display',serif; font-size:clamp(1.4rem,2.5vw,2rem); line-height:1.25; color:var(--text); margin-bottom:1rem; font-weight:600; }
        .section-body { font-size:1rem; color:var(--text2); line-height:1.8; font-weight:300; max-width:600px; }
        .feature-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:0.75rem; padding-bottom:2.5rem; }
        .feature-link { display:flex; align-items:center; gap:0.875rem; padding:1rem 1.125rem; background:var(--surface); border:1px solid var(--border); border-radius:8px; text-decoration:none; color:var(--text2); font-size:0.9rem; transition:all 0.15s; }
        .feature-link:hover { border-color:var(--accent); color:var(--accent); }
        .feature-dot { width:26px; height:26px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .games-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-top:2rem; }
        .game-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.75rem 1.5rem; text-decoration:none; color:inherit; display:block; transition:border-color 0.2s,transform 0.2s; }
        .game-card:hover { border-color:var(--accent); transform:translateY(-2px); }
        .game-icon { font-size:1.75rem; width:48px; height:48px; background:var(--accent-light); border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; }
        .game-title { font-family:'Lora',serif; font-size:1.1rem; font-weight:600; margin-bottom:0.5rem; color:var(--text); }
        .game-desc { font-size:0.82rem; color:var(--text3); line-height:1.6; }
        .game-tag { display:inline-block; margin-top:1rem; font-size:0.7rem; color:var(--accent); background:var(--accent-light); padding:3px 10px; border-radius:100px; font-weight:500; }
        .crisis-box { background:var(--accent-light); border:1px solid var(--border); border-radius:14px; padding:1.75rem; display:flex; gap:1.25rem; align-items:flex-start; margin:2rem 0 3rem; }
        .crisis-icon { width:44px; height:44px; background:var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .crisis-title { font-family:'Lora',serif; font-size:1.05rem; color:var(--accent); margin-bottom:0.5rem; font-weight:600; }
        .crisis-text { font-size:0.85rem; color:var(--text2); line-height:1.65; }
        .crisis-text a { color:var(--accent); font-weight:500; }
        .cta-block { text-align:center; padding:3rem 0 4rem; }
        .cta-title { font-family:'Lora',serif; font-size:clamp(1.4rem,2.5vw,2rem); line-height:1.25; margin-bottom:1rem; color:var(--text); }
        .cta-sub { font-size:1rem; color:var(--text2); margin-bottom:2rem; font-weight:300; }
        @media (max-width:680px) { .hero-section { grid-template-columns:1fr; min-height:auto; } .games-grid { grid-template-columns:1fr; } }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>

        <div className="hero-section">
          <div>
            <h1 className="hero-h1">
              {lang === 'ro'
                ? <>Dacă ai ajuns aici, <em>ceva s-a schimbat</em> deja în tine.</>
                : <>If you're here, <em>something has already changed</em> in you.</>}
            </h1>
            <p className="hero-lead">
              {lang === 'ro' ? 'Nu e despre voință. E despre a nu mai fi singur cu asta.' : "It's not about willpower. It's about not being alone with it."}
            </p>
            <p className="hero-lead">
              {lang === 'ro' ? 'NoBet e locul în care poți să respiri, să vorbești, să câștigi — fără noroc.' : 'NoBet is where you can breathe, talk, and win — without luck.'}
            </p>
            <button className="hero-btn" onClick={() => router.push('/evaluare')}>
              {lang === 'ro' ? 'Încep de azi' : 'I start today'}
            </button>
            <span className="hero-note">
              {lang === 'ro' ? 'Gratuit. Fără cont. Fără judecată.' : 'Free. No account. No judgment.'}
            </span>
          </div>

          <div className="cal-card">
            <div className="cal-header">
              {new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="cal-grid">
              {(lang === 'ro' ? ['L','M','M','J','V','S','D'] : ['M','T','W','T','F','S','S']).map((d, i) => (
                <div key={i} className="cal-dname">{d}</div>
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={`e${i}`} className="cal-day empty">0</div>
              ))}
              {Array.from({ length: 19 }, (_, i) => (
                <div key={i} className={`cal-day ${i < 14 ? 'checked' : ''}`}>{i + 1}</div>
              ))}
            </div>
            <div className="days-badge">
              <span className="days-number">14</span>
              <span className="days-label">{lang === 'ro' ? 'zile libere' : 'free days'}</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: '2rem' }} />

        <div className="feature-grid">
          {features.map((f, i) => (
            <a key={i} href={f.href} className="feature-link">
              <div className="feature-dot">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{f.label}</span>
              <span style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '0.8rem' }}>→</span>
            </a>
          ))}
        </div>

        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          <div className="section-label">{lang === 'ro' ? 'Jocuri de logică' : 'Logic games'}</div>
          <h2 className="section-title">
            {lang === 'ro' ? 'Când simți nevoia să joci — joacă. Dar fără noroc.' : 'When you feel the urge to play — play. But without luck.'}
          </h2>
          <p className="section-body">
            {lang === 'ro'
              ? 'Craving-ul trece în 15–30 de minute. Aceste jocuri îți ocupă mintea cu ceva care stimulează inteligența, nu dependența.'
              : 'The craving passes in 15–30 minutes. These games engage your mind with something that stimulates intelligence, not addiction.'}
          </p>
          <div className="games-grid">
            {GAMES.map((g, i) => (
              <a key={i} href={g.href} className="game-card">
                <div className="game-icon">{g.icon}</div>
                <div className="game-title">{lang === 'ro' ? g.ro : g.en}</div>
                <div className="game-desc">{lang === 'ro' ? g.descRo : g.descEn}</div>
                <span className="game-tag">{g.tag}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="crisis-box">
          <div className="crisis-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div className="crisis-title">{lang === 'ro' ? 'Linie de criză — România' : 'Crisis line — Romania'}</div>
            <p className="crisis-text">
              {lang === 'ro' ? 'Dacă simți că nu mai poți, poți suna acum. Nu ești singur.' : "If you feel you can't go on, you can call now. You're not alone."}<br /><br />
              <strong>{lang === 'ro' ? 'Telefon criză:' : 'Crisis line:'}</strong> <a href="tel:0800070070">0800 070 070</a> ({lang === 'ro' ? 'gratuit, 24/7' : 'free, 24/7'})<br />
              <strong>{lang === 'ro' ? 'Jucători Anonimi:' : 'Gamblers Anonymous:'}</strong> <a href="https://jucatorianonimi.ro" target="_blank" rel="noopener noreferrer">jucatorianonimi.ro</a>
            </p>
          </div>
        </div>

        <div className="cta-block">
          <h2 className="cta-title">
            {lang === 'ro' ? 'Fiecare zi fără jocuri de noroc este o victorie reală.' : 'Every day without gambling is a real victory.'}
          </h2>
          <p className="cta-sub">{lang === 'ro' ? 'Începe să le numeri. Noi suntem aici cu tine.' : 'Start counting them. We are here with you.'}</p>
          <button className="hero-btn" onClick={() => router.push('/evaluare')}>
            {lang === 'ro' ? 'Începe astăzi — gratuit' : 'Start today — free'}
          </button>
        </div>

      </div>
    </>
  )
}
