'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const EMOJIS = ['🌿','🍀','🌱','🌸','🌻','🍃','🦋','🐝','🌈','🎯','⭐','🔑']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for(let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]] }
  return a
}

function initCards() {
  return shuffle([...EMOJIS,...EMOJIS].map((e,i)=>({ id:i, emoji:e, flipped:false, matched:false })))
}

export default function MemoriePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [cards, setCards] = useState(initCards)
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)
  const [best, setBest] = useState<number|null>(null)
  const router = useRouter()

  useEffect(()=>{
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if(savedLang) setLang(savedLang)
    const b = localStorage.getItem('nobet_mem_best')
    if(b) setBest(parseInt(b))
  },[])

  const flip = useCallback((id: number) => {
    if(locked || won) return
    const card = cards.find(c=>c.id===id)
    if(!card || card.flipped || card.matched) return
    if(selected.length === 1 && selected[0] === id) return

    const newSel = [...selected, id]
    setCards(prev=>prev.map(c=>c.id===id?{...c,flipped:true}:c))

    if(newSel.length === 2) {
      setMoves(m=>m+1)
      setLocked(true)
      const [a,b] = newSel.map(sid=>cards.find(c=>c.id===sid)!)
      if(a.emoji === b.emoji) {
        setTimeout(()=>{
          setCards(prev=>prev.map(c=>newSel.includes(c.id)?{...c,matched:true}:c))
          const newMatches = matches+1
          setMatches(newMatches)
          setSelected([])
          setLocked(false)
          if(newMatches === EMOJIS.length) {
            setWon(true)
            const finalMoves = moves+1
            setBest(prev=>{ const nb=prev===null?finalMoves:Math.min(prev,finalMoves); localStorage.setItem('nobet_mem_best',String(nb)); return nb })
          }
        },500)
      } else {
        setTimeout(()=>{
          setCards(prev=>prev.map(c=>newSel.includes(c.id)&&!c.matched?{...c,flipped:false}:c))
          setSelected([])
          setLocked(false)
        },900)
      }
      setSelected(newSel)
    } else {
      setSelected(newSel)
    }
  },[cards, selected, locked, won, matches, moves])

  const reset = () => {
    setCards(initCards())
    setSelected([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setWon(false)
  }

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .mem-wrap { max-width:440px; margin:0 auto; padding:2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; margin-bottom:1.5rem; }
        .back-btn:hover { color:var(--accent); }
        .header-row { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.25rem; }
        .page-title { font-family:'Lora',serif; font-size:1.75rem; font-weight:600; color:var(--text); }
        .scores { display:flex; gap:8px; }
        .score-box { background:var(--accent); color:white; border-radius:8px; padding:6px 14px; text-align:center; min-width:64px; }
        .score-label { font-size:9px; text-transform:uppercase; letter-spacing:1px; opacity:0.8; }
        .score-val { font-size:1.1rem; font-weight:600; }
        .mem-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:1.25rem; }
        .mem-card { aspect-ratio:1; border-radius:10px; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:1.4rem; cursor:pointer; transition:all 0.2s; background:var(--surface); user-select:none; }
        .mem-card.flipped { background:var(--accent-light); border-color:var(--accent); }
        .mem-card.matched { background:var(--accent); border-color:var(--accent); }
        .mem-card:hover:not(.flipped):not(.matched) { border-color:var(--accent); transform:scale(1.05); }
        .won-banner { background:var(--accent-light); border:1px solid var(--accent); border-radius:12px; padding:1.25rem; text-align:center; margin-bottom:1rem; }
        .won-banner h2 { font-family:'Lora',serif; font-size:1.2rem; color:var(--accent); margin-bottom:0.4rem; }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; }
        .reset-btn:hover { opacity:0.85; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.6; margin-bottom:1.25rem; }
        .progress-bar { background:var(--surface2); border-radius:100px; height:6px; margin-bottom:1.25rem; overflow:hidden; }
        .progress-fill { background:var(--accent); height:100%; border-radius:100px; transition:width 0.3s; }
      `}</style>
      <div className="mem-wrap">
        <button className="back-btn" onClick={()=>router.push('/jocuri')}>← {lang==='ro'?'Jocuri':'Games'}</button>
        <div className="header-row">
          <h1 className="page-title">{lang==='ro'?'Memorie':'Memory'}</h1>
          <div className="scores">
            <div className="score-box"><div className="score-label">{lang==='ro'?'MUTĂRI':'MOVES'}</div><div className="score-val">{moves}</div></div>
            {best!==null&&<div className="score-box"><div className="score-label">BEST</div><div className="score-val">{best}</div></div>}
          </div>
        </div>
        <div className="craving-note">💚 {lang==='ro'?'Găsește toate perechile. Mintea ocupată nu mai simte dorința.':'Find all the pairs. A busy mind no longer feels the urge.'}</div>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${(matches/EMOJIS.length)*100}%`}}/></div>
        {won&&<div className="won-banner"><h2>🎉 {lang==='ro'?'Ai găsit toate perechile!':'You found all pairs!'}</h2><p style={{fontSize:'0.85rem',color:'var(--text2)'}}>{lang==='ro'?`Rezolvat în ${moves} mutări.`:`Solved in ${moves} moves.`}</p></div>}
        <div className="mem-grid">
          {cards.map(card=>(
            <div key={card.id} className={`mem-card ${card.flipped||card.matched?'flipped':''} ${card.matched?'matched':''}`} onClick={()=>flip(card.id)}>
              {card.flipped||card.matched?card.emoji:''}
            </div>
          ))}
        </div>
        <button className="reset-btn" onClick={reset}>{lang==='ro'?'Joc nou':'New game'}</button>
      </div>
    </>
  )
}
