'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [lang, setLang] = useState<'RO' | 'EN'>('RO')

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif", background: '#FDFAF7', color: '#1A1208', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background: #C1501F; color: white; padding: 16px 36px; border-radius: 100px; font-size: 17px; font-weight: 500; text-decoration: none; display: inline-block; transition: background 0.2s; }
        .btn-primary:hover { background: #8B3510; }
        .game-card { background: white; border: 1px solid #EDE0D4; border-radius: 20px; padding: 32px 28px; text-decoration: none; color: inherit; display: block; transition: border-color 0.2s, transform 0.2s; }
        .game-card:hover { border-color: #E8896A; transform: translateY(-3px); }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,250,247,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #EDE0D4', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href="/home" style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 22, color: '#C1501F', textDecoration: 'none' }}>NoBet</Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/companion" style={{ textDecoration: 'none', color: '#5C4A35', fontSize: 15 }}>Antrenor</Link>
          <Link href="/jocuri" style={{ textDecoration: 'none', color: '#5C4A35', fontSize: 15 }}>Jocuri</Link>
          <Link href="/journal" style={{ textDecoration: 'none', color: '#5C4A35', fontSize: 15 }}>Jurnal</Link>
          <Link href="/progress" style={{ textDecoration: 'none', color: '#5C4A35', fontSize: 15 }}>Progres</Link>
          <Link href="/evaluare" style={{ background: '#C1501F', color: 'white', padding: '9px 22px', borderRadius: 100, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>Încep de azi</Link>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['RO','EN'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ fontSize: 13, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, border: lang === l ? '1px solid #C1501F' : '1px solid transparent', background: lang === l ? '#FAF0EB' : 'none', color: lang === l ? '#C1501F' : '#9B8470', fontFamily: 'inherit' }}>{l}</button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '100px 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.15, fontWeight: 600, letterSpacing: -1, marginBottom: 28 }}>
            Dacă ai ajuns aici, <em style={{ color: '#C1501F' }}>ceva s-a schimbat</em> deja în tine.
          </h1>
          <p style={{ fontSize: 18, color: '#5C4A35', lineHeight: 1.75, fontWeight: 300, marginBottom: 12 }}>Nu e despre voință. E despre a nu mai fi singur cu asta.</p>
          <p style={{ fontSize: 18, color: '#5C4A35', lineHeight: 1.75, fontWeight: 300 }}>NoBet e locul în care poți să respiri, să vorbești, să câștigi — fără noroc.</p>
          <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <Link href="/evaluare" className="btn-primary">Încep de azi</Link>
            <span style={{ fontSize: 14, color: '#9B8470', fontStyle: 'italic' }}>Gratuit. Fără cont. Fără judecată.</span>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #EDE0D4' }}>
          <div style={{ background: '#C1501F', color: 'white', borderRadius: 14, padding: '14px 20px', textAlign: 'center', fontWeight: 500, marginBottom: 20 }}>Martie 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', marginBottom: 16 }}>
            {['L','M','M','J','V','S','D'].map((d,i) => <div key={i} style={{ fontSize: 11, color: '#9B8470', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>)}
            {Array.from({length: 19}, (_,i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, margin: '0 auto', background: i >= 5 ? '#FAF0EB' : 'transparent', color: i >= 5 ? '#C1501F' : '#5C4A35' }}>
                {i >= 5 ? i - 4 : ''}
              </div>
            ))}
          </div>
          <div style={{ background: '#C1501F', color: 'white', borderRadius: 16, padding: '18px 24px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 600, lineHeight: 1, display: 'block' }}>14</span>
            <span style={{ fontSize: 12, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4, display: 'block' }}>zile libere</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#C1501F', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px, 3vw, 32px)', color: 'white', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 24, maxWidth: 720, margin: '0 auto 24px' }}>
          „Nu am jucat pentru că îmi plăcea să câștig. Am jucat ca să nu mai simt nimic. Când am înțeles asta, totul s-a schimbat."
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>— Din cartea „100 de lei"</p>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '100px 40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 4vw, 42px)', lineHeight: 1.2, marginBottom: 20 }}>Fiecare zi fără jocuri de noroc este o victorie reală.</h2>
        <p style={{ fontSize: 18, color: '#5C4A35', marginBottom: 40, fontWeight: 300 }}>Începe să le numeri. Noi suntem aici cu tine.</p>
        <Link href="/evaluare" className="btn-primary">Începe astăzi — gratuit</Link>
      </div>

      <footer style={{ borderTop: '1px solid #EDE0D4', padding: 40, maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', color: '#9B8470', fontSize: 14 }}>
        <span>© 2026 NoBet. Cu grijă, pentru oameni.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: '#9B8470', textDecoration: 'none' }}>Confidențialitate</a>
          <a href="#" style={{ color: '#9B8470', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
