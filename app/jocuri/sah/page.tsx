'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const PIECES: Record<string, string> = {
  K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
  k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟',
}

const INIT = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
]

function isWhite(p: string) { return p === p.toUpperCase() && p.trim() !== '' }
function isBlack(p: string) { return p === p.toLowerCase() && p.trim() !== '' }

export default function SahPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [board, setBoard] = useState(INIT.map(r=>[...r]))
  const [selected, setSelected] = useState<[number,number]|null>(null)
  const [turn, setTurn] = useState<'white'|'black'>('white')
  const [status, setStatus] = useState('')
  const [moves, setMoves] = useState<string[]>([])
  const router = useRouter()

  useEffect(()=>{
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if(savedLang) setLang(savedLang)
  },[])

  const getLegalMoves = (b: string[][], r: number, c: number): [number,number][] => {
    const piece = b[r][c]
    if(!piece.trim()) return []
    const white = isWhite(piece)
    const moves: [number,number][] = []
    const add = (nr: number, nc: number) => {
      if(nr<0||nr>7||nc<0||nc>7) return false
      const target = b[nr][nc]
      if(!target.trim()) { moves.push([nr,nc]); return true }
      if(white && isBlack(target)) { moves.push([nr,nc]); return false }
      if(!white && isWhite(target)) { moves.push([nr,nc]); return false }
      return false
    }
    const slide = (dr: number, dc: number) => { let nr=r+dr,nc=c+dc; while(nr>=0&&nr<8&&nc>=0&&nc<8) { if(!add(nr,nc)) break; if(b[nr][nc].trim()) break; nr+=dr; nc+=dc } }
    const p = piece.toLowerCase()
    if(p==='p') {
      const dir = white ? -1 : 1
      const start = white ? 6 : 1
      if(r+dir>=0&&r+dir<8&&!b[r+dir][c].trim()) { moves.push([r+dir,c]); if(r===start&&!b[r+2*dir][c].trim()) moves.push([r+2*dir,c]) }
      for(const dc of [-1,1]) { const nr=r+dir,nc=c+dc; if(nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc].trim()&&(white?isBlack(b[nr][nc]):isWhite(b[nr][nc]))) moves.push([nr,nc]) }
    } else if(p==='r') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1) }
    else if(p==='b') { slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1) }
    else if(p==='q') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1);slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1) }
    else if(p==='n') { for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc) }
    else if(p==='k') { for(const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r+dr,c+dc) }
    return moves
  }

  const colNames = ['a','b','c','d','e','f','g','h']

  const handleClick = (r: number, c: number) => {
    const piece = board[r][c]
    if(selected) {
      const [sr,sc] = selected
      const legal = getLegalMoves(board, sr, sc)
      const isLegal = legal.some(([lr,lc])=>lr===r&&lc===c)
      if(isLegal) {
        const nb = board.map(row=>[...row])
        const moved = nb[sr][sc]
        nb[r][c] = moved
        nb[sr][sc] = ' '
        if(moved.toLowerCase()==='p'&&(r===0||r===7)) nb[r][c] = moved==='P'?'Q':'q'
        const capture = board[r][c].trim()
        const moveStr = `${PIECES[moved]}${colNames[sc]}${8-sr}→${colNames[c]}${8-r}${capture?'×'+PIECES[capture]:''}`
        setMoves(m=>[moveStr,...m].slice(0,20))
        setBoard(nb)
        setTurn(t=>t==='white'?'black':'white')
        setSelected(null)
        if(capture.toLowerCase()==='k') setStatus(turn==='white'?'⬜ Alb câștigă!':'⬛ Negru câștigă!')
        return
      }
      setSelected(null)
      if(!piece.trim()) return
    }
    if(!piece.trim()) return
    if(turn==='white'&&!isWhite(piece)) return
    if(turn==='black'&&!isBlack(piece)) return
    setSelected([r,c])
  }

  const reset = () => { setBoard(INIT.map(r=>[...r])); setSelected(null); setTurn('white'); setStatus(''); setMoves([]) }

  const legalMoves = selected ? getLegalMoves(board, selected[0], selected[1]) : []

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .sah-wrap { max-width: 520px; margin: 0 auto; padding: 2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; margin-bottom:1.5rem; }
        .back-btn:hover { color:var(--accent); }
        .page-title { font-family:'Lora',serif; font-size:1.75rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
        .page-sub { font-size:0.875rem; color:var(--text2); margin-bottom:1.25rem; }
        .turn-bar { display:flex; align-items:center; gap:10px; margin-bottom:1rem; padding:0.75rem 1rem; background:var(--surface); border:1px solid var(--border); border-radius:10px; font-size:0.9rem; }
        .turn-dot { width:14px; height:14px; border-radius:50%; border:1.5px solid #ccc; }
        .board-wrap { position:relative; margin-bottom:1rem; }
        .chess-board { display:grid; grid-template-columns:repeat(8,1fr); border:2px solid var(--accent); border-radius:8px; overflow:hidden; }
        .sq { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:clamp(1.2rem,5vw,1.8rem); cursor:pointer; position:relative; transition:background 0.1s; user-select:none; }
        .sq.light { background:#f0f4f1; }
        .sq.dark { background:#c8d5c9; }
        .sq.selected { background:#a8c5a0 !important; }
        .sq.legal::after { content:''; position:absolute; width:28%; height:28%; background:rgba(45,106,79,0.45); border-radius:50%; }
        .sq.legal.has-piece::after { box-shadow:inset 0 0 0 3px rgba(45,106,79,0.6); background:transparent; width:90%; height:90%; }
        .sq.last { background:#b8d4b0 !important; }
        .coords-col { position:absolute; left:-16px; top:0; height:100%; display:flex; flex-direction:column; justify-content:space-around; font-size:9px; color:var(--text3); }
        .coords-row { display:flex; justify-content:space-around; font-size:9px; color:var(--text3); margin-top:2px; }
        .status-bar { background:var(--accent); color:white; border-radius:10px; padding:0.875rem; text-align:center; font-family:'Lora',serif; font-size:1.1rem; margin-bottom:1rem; }
        .moves-log { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0.875rem; max-height:100px; overflow-y:auto; margin-bottom:1rem; }
        .moves-log p { font-size:0.78rem; color:var(--text2); margin-bottom:2px; }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; }
        .reset-btn:hover { opacity:0.85; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.6; margin-bottom:1.25rem; }
      `}</style>
      <div className="sah-wrap">
        <button className="back-btn" onClick={()=>router.push('/home')}>← {lang==='ro'?'Înapoi':'Back'}</button>
        <h1 className="page-title">{lang==='ro'?'Șah':'Chess'}</h1>
        <p className="page-sub">{lang==='ro'?'Joacă cu un prieten pe același ecran. Strategia bate norocul.':'Play with a friend on the same screen. Strategy beats luck.'}</p>
        <div className="craving-note">
          💚 {lang==='ro'?'Câteva mutări și dorința trece. Mintea ta e mai puternică decât crezi.':'A few moves and the urge passes. Your mind is stronger than you think.'}
        </div>
        {status && <div className="status-bar">{status}</div>}
        <div className="turn-bar">
          <div className="turn-dot" style={{background:turn==='white'?'white':'#1a1a1a'}}/>
          <span>{turn==='white'?(lang==='ro'?'Rândul albului':'White\'s turn'):(lang==='ro'?'Rândul negrului':'Black\'s turn')}</span>
        </div>
        <div style={{paddingLeft:20}}>
          <div className="board-wrap">
            <div className="coords-col">{[8,7,6,5,4,3,2,1].map(n=><span key={n}>{n}</span>)}</div>
            <div className="chess-board">
              {board.map((row,r)=>row.map((piece,c)=>{
                const light=(r+c)%2===0
                const isSel=selected&&selected[0]===r&&selected[1]===c
                const isLegal=legalMoves.some(([lr,lc])=>lr===r&&lc===c)
                return (
                  <div key={`${r}-${c}`}
                    className={`sq ${light?'light':'dark'} ${isSel?'selected':''} ${isLegal?'legal':''} ${isLegal&&piece.trim()?'has-piece':''}`}
                    onClick={()=>!status&&handleClick(r,c)}>
                    {piece.trim()?PIECES[piece]:''}
                  </div>
                )
              }))}
            </div>
          </div>
          <div className="coords-row">{colNames.map(l=><span key={l}>{l}</span>)}</div>
        </div>
        {moves.length>0&&<div className="moves-log">{moves.map((m,i)=><p key={i}>{m}</p>)}</div>}
        <button className="reset-btn" style={{marginTop:'1rem'}} onClick={reset}>{lang==='ro'?'Joc nou':'New game'}</button>
      </div>
    </>
  )
}
