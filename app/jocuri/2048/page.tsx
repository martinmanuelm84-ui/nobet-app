'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

type Board = (number|null)[][]

function newBoard(): Board { return Array(4).fill(null).map(()=>Array(4).fill(null)) }

function addRandom(b: Board): Board {
  const empty: [number,number][] = []
  b.forEach((r,ri)=>r.forEach((c,ci)=>{ if(!c) empty.push([ri,ci]) }))
  if(!empty.length) return b
  const [r,c] = empty[Math.floor(Math.random()*empty.length)]
  const nb = b.map(row=>[...row])
  nb[r][c] = Math.random()<0.9 ? 2 : 4
  return nb
}

function initBoard(): Board { return addRandom(addRandom(newBoard())) }

function slideRow(row: (number|null)[]): { row:(number|null)[], score:number } {
  const nums = row.filter(Boolean) as number[]
  let score = 0
  const merged: number[] = []
  let i = 0
  while(i < nums.length) {
    if(i+1 < nums.length && nums[i]===nums[i+1]) {
      merged.push(nums[i]*2); score+=nums[i]*2; i+=2
    } else { merged.push(nums[i]); i++ }
  }
  while(merged.length<4) merged.push(0)
  return { row: merged.map(n=>n||null), score }
}

function move(b: Board, dir: string): { board:Board, score:number, moved:boolean } {
  let score = 0
  let moved = false
  let nb = b.map(r=>[...r])
  if(dir==='left') {
    nb = nb.map(row=>{ const r=slideRow(row); score+=r.score; if(r.row.join()!==row.join()) moved=true; return r.row })
  } else if(dir==='right') {
    nb = nb.map(row=>{ const rev=[...row].reverse(); const r=slideRow(rev); score+=r.score; const res=[...r.row].reverse(); if(res.join()!==row.join()) moved=true; return res })
  } else if(dir==='up') {
    for(let c=0;c<4;c++) {
      const col=nb.map(r=>r[c]); const r=slideRow(col); score+=r.score
      r.row.forEach((v,ri)=>{ if(nb[ri][c]!==v) moved=true; nb[ri][c]=v })
    }
  } else if(dir==='down') {
    for(let c=0;c<4;c++) {
      const col=nb.map(r=>r[c]).reverse(); const r=slideRow(col); score+=r.score
      const res=[...r.row].reverse()
      res.forEach((v,ri)=>{ if(nb[ri][c]!==v) moved=true; nb[ri][c]=v })
    }
  }
  return { board:nb, score, moved }
}

const COLORS: Record<number,string> = {
  2:'#eef5f0', 4:'#d4eada', 8:'#5cb87a', 16:'#4aaa6e',
  32:'#3a9c60', 64:'#2a8e52', 128:'#1e7d44', 256:'#166636',
  512:'#0f5029', 1024:'#0a3d1e', 2048:'#062914'
}
const TEXT_COLORS: Record<number,string> = {
  2:'#1a1a1a', 4:'#1a1a1a', 8:'#fff', 16:'#fff', 32:'#fff',
  64:'#fff', 128:'#fff', 256:'#fff', 512:'#fff', 1024:'#fff', 2048:'#fff'
}

export default function Game2048() {
  const [lang, setLang] = useState<Lang>('ro')
  const [board, setBoard] = useState<Board>(initBoard)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if(savedLang) setLang(savedLang)
    const b = localStorage.getItem('nobet_2048_best')
    if(b) setBest(parseInt(b))
  },[])

  const handleMove = useCallback((dir: string)=>{
    if(over) return
    setBoard(prev=>{
      const { board:nb, score:s, moved } = move(prev, dir)
      if(!moved) return prev
      const withNew = addRandom(nb)
      setScore(sc=>{ const ns=sc+s; setBest(b=>{ const nb2=Math.max(b,ns); localStorage.setItem('nobet_2048_best',String(nb2)); return nb2 }); return ns })
      const hasWin = withNew.some(r=>r.some(c=>c===2048))
      if(hasWin) setWon(true)
      const hasMoves = withNew.some((r,ri)=>r.some((c,ci)=>{
        if(!c) return true
        if(ri<3 && withNew[ri+1][ci]===c) return true
        if(ci<3 && withNew[ri][ci+1]===c) return true
        return false
      }))
      if(!hasMoves) setOver(true)
      return withNew
    })
  },[over])

  useEffect(()=>{
    const onKey=(e: KeyboardEvent)=>{
      const map: Record<string,string> = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' }
      if(map[e.key]) { e.preventDefault(); handleMove(map[e.key]) }
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[handleMove])

  let touchStart: {x:number,y:number}|null = null

  const reset = ()=>{ setBoard(initBoard()); setScore(0); setOver(false); setWon(false) }

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .wrap-2048 { max-width: 420px; margin: 0 auto; padding: 2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; text-decoration:none; margin-bottom:1.5rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; }
        .back-btn:hover { color:var(--accent); }
        .header-row { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:1.25rem; }
        .page-title { font-family:'Lora',serif; font-size:1.75rem; font-weight:600; color:var(--text); }
        .scores { display:flex; gap:8px; }
        .score-box { background:var(--accent); color:white; border-radius:8px; padding:6px 14px; text-align:center; min-width:64px; }
        .score-label { font-size:9px; text-transform:uppercase; letter-spacing:1px; opacity:0.8; }
        .score-val { font-size:1.1rem; font-weight:600; }
        .grid-2048 { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; background:var(--accent); padding:10px; border-radius:12px; margin-bottom:1rem; touch-action:none; }
        .tile { aspect-ratio:1; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:clamp(1rem,5vw,1.5rem); transition:background 0.1s; }
        .tile-empty { background:rgba(255,255,255,0.15); }
        .dir-btns { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:1rem; }
        .dir-btn { padding:0.75rem; border:1px solid var(--border); border-radius:8px; background:var(--surface); font-size:1.1rem; cursor:pointer; transition:all 0.15s; }
        .dir-btn:hover { border-color:var(--accent); background:var(--accent-light); }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; }
        .reset-btn:hover { opacity:0.85; }
        .banner { border-radius:12px; padding:1.25rem; text-align:center; margin-bottom:1rem; }
        .banner.won { background:var(--accent-light); border:1px solid var(--accent); }
        .banner.over { background:#fef2f2; border:1px solid #fca5a5; }
        .banner h2 { font-family:'Lora',serif; font-size:1.2rem; margin-bottom:0.4rem; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.6; margin-bottom:1.25rem; }
        .hint { font-size:0.78rem; color:var(--text3); text-align:center; margin-bottom:0.75rem; }
      `}</style>
      <div className="wrap-2048">
        <button className="back-btn" onClick={()=>router.push('/home')}>← {lang==='ro'?'Înapoi':'Back'}</button>
        <div className="header-row">
          <h1 className="page-title">2048</h1>
          <div className="scores">
            <div className="score-box"><div className="score-label">SCOR</div><div className="score-val">{score}</div></div>
            <div className="score-box"><div className="score-label">BEST</div><div className="score-val">{best}</div></div>
          </div>
        </div>
        <div className="craving-note">
          💚 {lang==='ro'?'Câteva minute cu 2048 și dorința trece. Rămâi cu noi.':'A few minutes with 2048 and the urge passes. Stay with us.'}
        </div>
        {won && <div className="banner won"><h2>🎉 {lang==='ro'?'Ai ajuns la 2048!':'You reached 2048!'}</h2><p style={{fontSize:'0.85rem'}}>{lang==='ro'?'Continuă sau începe din nou.':'Keep going or start over.'}</p></div>}
        {over && <div className="banner over"><h2>⏹ {lang==='ro'?'Joc terminat':'Game over'}</h2><p style={{fontSize:'0.85rem',color:'#6b6b6b'}}>{lang==='ro'?'Nicio mutare posibilă. Încearcă din nou.':'No moves left. Try again.'}</p></div>}
        <div className="grid-2048"
          onTouchStart={e=>{ const t=e.touches[0]; touchStart={x:t.clientX,y:t.clientY} }}
          onTouchEnd={e=>{ if(!touchStart) return; const t=e.changedTouches[0]; const dx=t.clientX-touchStart.x; const dy=t.clientY-touchStart.y; if(Math.abs(dx)>Math.abs(dy)) handleMove(dx>0?'right':'left'); else handleMove(dy>0?'down':'up'); touchStart=null }}>
          {board.map((row,ri)=>row.map((cell,ci)=>(
            <div key={`${ri}-${ci}`} className={`tile ${!cell?'tile-empty':''}`}
              style={{ background:cell?COLORS[cell]||'#062914':'', color:cell?TEXT_COLORS[cell]||'#fff':'' }}>
              {cell||''}
            </div>
          )))}
        </div>
        <p className="hint">{lang==='ro'?'Săgeți pe tastatură sau swipe pe telefon':'Arrow keys or swipe on mobile'}</p>
        <div className="dir-btns">
          <div></div>
          <button className="dir-btn" onClick={()=>handleMove('up')}>↑</button>
          <div></div>
          <button className="dir-btn" onClick={()=>handleMove('left')}>←</button>
          <button className="dir-btn" onClick={()=>handleMove('down')}>↓</button>
          <button className="dir-btn" onClick={()=>handleMove('right')}>→</button>
        </div>
        <button className="reset-btn" onClick={reset}>{lang==='ro'?'Joc nou':'New game'}</button>
      </div>
    </>
  )
}
