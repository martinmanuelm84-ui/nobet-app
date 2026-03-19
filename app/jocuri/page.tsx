'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const GAMES = {
  ro: [
    { icon:'♟️', title:'Șah', desc:'Strategie pură contra calculatorului. Fiecare mutare contează.', tag:'Strategie', href:'/jocuri/sah', time:'10–30 min', ready:true },
    { icon:'🔢', title:'Sudoku', desc:'Completează grila 9×9. Trei dificultăți disponibile.', tag:'Logică', href:'/jocuri/sudoku', time:'5–15 min', ready:true },
    { icon:'🧩', title:'2048', desc:'Combină numerele și ajunge la 2048. Simplu de început, greu de oprit.', tag:'Concentrare', href:'/jocuri/2048', time:'5–20 min', ready:true },
    { icon:'🔤', title:'Cuvântul zilei', desc:'Ghicește cuvântul ascuns în 6 încercări. Un joc nou în fiecare zi.', tag:'Vocabular', href:'/jocuri/cuvant', time:'3–5 min', ready:true },
    { icon:'⬛', title:'Nonograme', desc:'Descoperă imaginea ascunsă rezolvând indicii numerice. Meditativ.', tag:'Răbdare', href:'/jocuri/nonograme', time:'10–20 min', ready:true },
    { icon:'🃏', title:'Memorie', desc:'Găsește toate perechile. Antrenează-ți atenția și memoria.', tag:'Memorie', href:'/jocuri/memorie', time:'3–8 min', ready:true },
  ],
  en: [
    { icon:'♟️', title:'Chess', desc:'Pure strategy against the computer. Every move matters.', tag:'Strategy', href:'/jocuri/sah', time:'10–30 min', ready:true },
    { icon:'🔢', title:'Sudoku', desc:'Complete the 9×9 grid. Three difficulty levels.', tag:'Logic', href:'/jocuri/sudoku', time:'5–15 min', ready:true },
    { icon:'🧩', title:'2048', desc:'Combine numbers and reach 2048. Easy to start, hard to stop.', tag:'Focus', href:'/jocuri/2048', time:'5–20 min', ready:true },
    { icon:'🔤', title:'Word of the day', desc:'Guess the hidden word in 6 tries. A new game every day.', tag:'Vocabulary', href:'/jocuri/cuvant', time:'3–5 min', ready:true },
    { icon:'⬛', title:'Nonograms', desc:'Reveal the hidden image by solving numerical clues.', tag:'Patience', href:'/jocuri/nonograme', time:'10–20 min', ready:true },
    { icon:'🃏', title:'Memory', desc:'Find all the pairs. Train your attention and short-term memory.', tag:'Memory', href:'/jocuri/memorie', time:'3–8 min', ready:true },
  ],
}

export default function JocuriPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  const games = GAMES[lang]

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .jocuri-wrap { max-width:900px; margin:0 auto; padding:2.5rem 1.5rem 4rem; }
        .page-label { font-size:0.75rem; font-weight:500; color:var(--accent); text-transform:uppercase; letter-spacing:2px; margin-bottom:0.75rem; }
        .page-title { font-family:'Lora',serif; font-size:clamp(1.75rem,4vw,2.5rem); font-weight:600; line-height:1.2; color:var(--text); margin-bottom:0.75rem; letter-spacing:-0.5px; }
        .page-sub { font-size:1rem; color:var(--text2); line-height:1.75; font-weight:300; max-width:560px; margin-bottom:2rem; }
        .craving-banner { background:var(--accent-light); border:1px solid var(--border); border-radius:12px; padding:1.125rem 1.5rem; font-size:0.88rem; color:var(--text2); line-height:1.65; margin-bottom:2rem; display:flex; align-items:flex-start; gap:12px; }
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:2rem; }
        .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.25rem; text-align:center; }
        .stat-num { font-family:'Lora',serif; font-size:2rem; font-weight:600; color:var(--accent); line-height:1; margin-bottom:4px; }
        .stat-label { font-size:0.78rem; color:var(--text2); line-height:1.4; }
        .games-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:2.5rem; }
        .game-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:1.75rem 1.5rem; text-decoration:none; color:inherit; display:flex; flex-direction:column; position:relative; }
        .game-card.ready { cursor:pointer; transition:border-color 0.2s,transform 0.2s; }
        .game-card.ready:hover { border-color:var(--accent); transform:translateY(-3px); }
        .game-card.soon { opacity:0.55; cursor:default; }
        .game-icon { font-size:1.75rem; width:52px; height:52px; background:var(--accent-light); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:1.125rem; }
        .game-title { font-family:'Lora',serif; font-size:1.15rem; font-weight:600; margin-bottom:0.5rem; color:var(--text); }
        .game-desc { font-size:0.82rem; color:var(--text3); line-height:1.65; flex:1; }
        .game-footer { display:flex; align-items:center; justify-content:space-between; margin-top:1.25rem; }
        .game-tag { font-size:0.7rem; color:var(--accent); background:var(--accent-light); padding:3px 10px; border-radius:100px; font-weight:500; }
        .game-time { font-size:0.72rem; color:var(--text3); }
        .soon-badge { position:absolute; top:14px; right:14px; font-size:0.65rem; background:var(--surface2); color:var(--text3); padding:3px 8px; border-radius:100px; font-weight:500; }
        .bottom-note { background:var(--accent); border-radius:14px; padding:1.75rem 2rem; text-align:center; }
        .bottom-note h3 { font-family:'Lora',serif; font-size:1.2rem; color:white; margin-bottom:0.5rem; }
        .bottom-note p { font-size:0.85rem; color:rgba(255,255,255,0.8); line-height:1.6; }
        @media (max-width:680px) { .games-grid { grid-template-columns:1fr; } .stats-row { grid-template-columns:1fr 1fr; } }
      `}</style>

      <div className="jocuri-wrap">
        <div className="page-label">{lang==='ro'?'Jocuri de logică':'Logic games'}</div>
        <h1 className="page-title">
          {lang==='ro'?'Când simți nevoia să joci — joacă. Dar fără noroc.':'When you feel the urge — play. But without luck.'}
        </h1>
        <p className="page-sub">
          {lang==='ro'
            ?'Craving-ul trece în 15–30 de minute. Aceste jocuri îți ocupă mintea cu ceva care stimulează inteligența, nu dependența.'
            :'The craving passes in 15–30 minutes. These games engage your mind with something that stimulates intelligence, not addiction.'}
        </p>
        <div className="craving-banner">
          <span style={{fontSize:'1.25rem',flexShrink:0}}>💚</span>
          <span>{lang==='ro'?'Alege un joc și rămâi cu noi câteva minute. Dorința trece, tu rămâi.':'Pick a game and stay with us a few minutes. The urge passes, you stay.'}</span>
        </div>
        <div className="stats-row">
          <div className="stat-card"><div className="stat-num">6</div><div className="stat-label">{lang==='ro'?'jocuri disponibile':'games available'}</div></div>
          <div className="stat-card"><div className="stat-num">0%</div><div className="stat-label">{lang==='ro'?'element de noroc':'element of luck'}</div></div>
          <div className="stat-card"><div className="stat-num">15'</div><div className="stat-label">{lang==='ro'?'și dorința trece':'and the urge passes'}</div></div>
        </div>
        <div className="games-grid">
          {games.map((g, i) => (
            <div key={i} className={`game-card ${g.ready?'ready':'soon'}`} onClick={()=>g.ready&&router.push(g.href)}>
              {!g.ready && <span className="soon-badge">{lang==='ro'?'În curând':'Soon'}</span>}
              <div className="game-icon">{g.icon}</div>
              <div className="game-title">{g.title}</div>
              <div className="game-desc">{g.desc}</div>
              <div className="game-footer">
                <span className="game-tag">{g.tag}</span>
                <span className="game-time">⏱ {g.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bottom-note">
          <h3>{lang==='ro'?'Fiecare minut jucat este un minut câștigat.':'Every minute played is a minute won.'}</h3>
          <p>{lang==='ro'?'Nu câștigai bani oricum. Dar câștigai ceva mai prețios: timp liber de dependență.':'You weren\'t going to win money anyway. But you\'re winning something more precious: time free from addiction.'}</p>
        </div>
      </div>
    </>
  )
}
