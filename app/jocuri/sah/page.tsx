'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const PIECES: Record<string, string> = {
  K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
  k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟',
}

const PIECE_VALUE: Record<string, number> = { p:1, n:3, b:3, r:5, q:9, k:100 }

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

function isWhite(p: string) { return p !== ' ' && p === p.toUpperCase() }
function isBlack(p: string) { return p !== ' ' && p === p.toLowerCase() }

function getLegalMoves(b: string[][], r: number, c: number): [number,number][] {
  const piece = b[r][c]
  if(piece === ' ') return []
  const white = isWhite(piece)
  const moves: [number,number][] = []
  const add = (nr: number, nc: number) => {
    if(nr<0||nr>7||nc<0||nc>7) return false
    const t = b[nr][nc]
    if(t === ' ') { moves.push([nr,nc]); return true }
    if(white && isBlack(t)) { moves.push([nr,nc]); return false }
    if(!white && isWhite(t)) { moves.push([nr,nc]); return false }
    return false
  }
  const slide = (dr: number, dc: number) => {
    let nr=r+dr, nc=c+dc
    while(nr>=0&&nr<8&&nc>=0&&nc<8) {
      const cont = add(nr,nc)
      if(!cont || b[nr][nc] !== ' ') break
      nr+=dr; nc+=dc
    }
  }
  const p = piece.toLowerCase()
  if(p==='p') {
    const dir = white ? -1 : 1
    const start = white ? 6 : 1
    if(r+dir>=0&&r+dir<8&&b[r+dir][c]===' ') {
      moves.push([r+dir,c])
      if(r===start&&b[r+2*dir][c]===' ') moves.push([r+2*dir,c])
    }
    for(const dc of [-1,1]) {
      const nr=r+dir, nc=c+dc
      if(nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc]!==' '&&(white?isBlack(b[nr][nc]):isWhite(b[nr][nc]))) moves.push([nr,nc])
    }
  } else if(p==='r') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1) }
  else if(p==='b') { slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1) }
  else if(p==='q') { slide(-1,0);slide(1,0);slide(0,-1);slide(0,1);slide(-1,-1);slide(-1,1);slide(1,-1);slide(1,1) }
  else if(p==='n') { for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc) }
  else if(p==='k') { for(const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r+dr,c+dc) }
  return moves
}

function applyMove(b: string[][], from: [number,number], to: [number,number]): string[][] {
  const nb = b.map(row=>[...row])
  const piece = nb[from[0]][from[1]]
  nb[to[0]][to[1]] = piece
  nb[from[0]][from[1]] = ' '
  if(piece==='P'&&to[0]===0) nb[to[0]][to[1]]='Q'
  if(piece==='p'&&to[0]===7) nb[to[0]][to[1]]='q'
  return nb
}

function scoreBoard(b: string[][]): number {
  let score = 0
  b.forEach(row=>row.forEach(p=>{
    if(p===' ') return
    const val = PIECE_VALUE[p.toLowerCase()] || 0
    score += isWhite(p) ? -val : val
  }))
  return score
}

function getBestMove(b: string[][]): { from:[number,number], to:[number,number] } | null {
  let best: { from:[number,number], to:[number,number] } | null = null
  let bestScore = -Infinity
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    if(!isBlack(b[r][c])) continue
    const moves = getLegalMoves(b,r,c)
    for(const [tr,tc] of moves) {
      const nb = applyMove(b,[r,c],[tr,tc])
      let score = scoreBoard(nb)
      // look one move ahead
      let minReply = Infinity
      for(let r2=0;r2<8;r2++) for(let c2=0;c2<8;c2++) {
        if(!isWhite(nb[r2][c2])) continue
        const replies = getLegalMoves(nb,r2,c2)
        for(const [tr2,tc2] of replies) {
          const nb2 = applyMove(nb,[r2,c2],[tr2,tc2])
          minReply = Math.min(minReply, scoreBoard(nb2))
        }
      }
      if(minReply !== Infinity) score = minReply
      if(score > bestScore) { bestScore = score; best = { from:[r,c], to:[tr,tc] } }
    }
  }
  return best
}

const colNames = ['a','b','c','d','e','f','g','h']

export default function SahPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [board, setBoard] = useState(INIT.map(r=>[...r]))
  const [selected, setSelected] = useState<[number,number]|null>(null)
  const [status, setStatus] = useState('')
  const [thinking, setThinking] = useState(false)
  const [lastMove, setLastMove] = useState<[[number,number],[number,number]]|null>(null)
  const [moves, setMoves] = useState<string[]>([])
  const router = useRouter()

  useEffect(()=>{
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if(savedLang) setLang(savedLang)
  },[])

  const doAiMove = useCallback((b: string[][]) => {
    setThinking(true)
    setTimeout(()=>{
      const move = getBestMove(b)
      if(!move) { setStatus(lang==='ro'?'⬛ Negru nu are mutări — egalitate!':'⬛ Black has no moves — draw!'); setThinking(false); return }
      const piece = b[move.from[0]][move.from[1]]
      const capture = b[move.to[0]][move.to[1]]
      const nb = applyMove(b, move.from, move.to)
      const moveStr = `⬛ ${PIECES[piece]}${colNames[move.from[1]]}${8-move.from[0]}→${colNames[move.to[1]]}${8-move.to[0]}${capture!==' '?'×'+PIECES[capture]:''}`
      setMoves(m=>[moveStr,...m].slice(0,20))
      setLastMove([move.from, move.to])
      setBoard(nb)
      setThinking(false)
      if(capture.toLowerCase()==='k') setStatus(lang==='ro'?'⬛ Negru câștigă!':'⬛ Black wins!')
    }, 400)
  },[lang])

  const handleClick = (r: number, c: number) => {
    if(status||thinking) return
    const piece = board[r][c]
    if(selected) {
      const [sr,sc] = selected
      const legal = getLegalMoves(board,sr,sc)
      const isLegal = legal.some(([lr,lc])=>lr===r&&lc===c)
      if(isLegal) {
        const moved = board[sr][sc]
        const capture = board[r][c]
        const nb = applyMove(board,[sr,sc],[r,c])
        const moveStr = `⬜ ${PIECES[moved]}${colNames[sc]}${8-sr}→${colNames[c]}${8-r}${capture!==' '?'×'+PIECES[capture]:''}`
        setMoves(m=>[moveStr,...m].slice(0,20))
        setLastMove([[sr,sc],[r,c]])
        setSelected(null)
        setBoard(nb)
        if(capture.toLowerCase()==='k') { setStatus(lang==='ro'?'⬜ Alb câștigă!':'⬜ White wins!'); return }
        doAiMove(nb)
        return
      }
      setSelected(null)
      if(piece===' '||!isWhite(piece)) return
    }
    if(piece===' '||!isWhite(piece)) return
    setSelected([r,c])
  }

  const reset = () => {
    setBoard(INIT.map(r=>[...r]))
    setSelected(null)
    setStatus('')
    setThinking(false)
    setLastMove(null)
    setMoves([])
  }

  const legalMoves = selected ? getLegalMoves(board,selected[0],selected[1]) : []

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .sah-wrap { max-width:520px; margin:0 auto; padding:2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; margin-bottom:1.5rem; }
        .back-btn:hover { color:var(--accent); }
        .page-title { font-family:'Lora',serif; font-size:1.75rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
        .page-sub { font-size:0.875rem; color:var(--text2); margin-bottom:1.25rem; }
        .turn-bar { display:flex; align-items:center; gap:10px; margin-bottom:1rem; padding:0.75rem 1rem; background:var(--surface); border:1px solid var(--border); border-radius:10px; font-size:0.9rem; }
        .turn-dot { width:14px; height:14px; border-radius:50%; border:1.5px solid #ccc; }
        .chess-board { display:grid; grid-template-columns:repeat(8,1fr); border:2px solid var(--accent); border-radius:8px; overflow:hidden; margin-bottom:6px; }
        .sq { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:clamp(1.2rem,5vw,1.8rem); cursor:pointer; position:relative; user-select:none; }
        .sq.light { background:#f0f4f1; }
        .sq.dark { background:#c8d5c9; }
        .sq.selected { background:#a8c5a0 !important; }
        .sq.last-from { background:#d4e8d0 !important; }
        .sq.last-to { background:#b8d8b0 !important; }
        .sq.legal::after { content:''; position:absolute; width:28%; height:28%; background:rgba(45,106,79,0.45); border-radius:50%; pointer-events:none; }
        .sq.legal.has-piece::after { box-shadow:inset 0 0 0 3px rgba(45,106,79,0.6); background:transparent; width:90%; height:90%; }
        .coords-row { display:flex; justify-content:space-around; font-size:9px; color:var(--text3); margin-bottom:1rem; padding:0 2px; }
        .status-bar { background:var(--accent); color:white; border-radius:10px; padding:0.875rem; text-align:center; font-family:'Lora',serif; font-size:1.1rem; margin-bottom:1rem; }
        .thinking-bar { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:0.75rem 1rem; text-align:center; font-size:0.85rem; color:var(--accent); margin-bottom:1rem; }
        .moves-log { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0.875rem; max-height:90px; overflow-y:auto; margin-bottom:1rem; }
        .moves-log p { font-size:0.78rem; color:var(--text2); margin-bottom:2px; font-family:monospace; }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; }
        .reset-btn:hover { opacity:0.85; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.6; margin-bottom:1.25rem; }
      `}</style>
      <div className="sah-wrap">
        <button className="back-btn" onClick={()=>router.push('/jocuri')}>← {lang==='ro'?'Jocuri':'Games'}</button>
        <h1 className="page-title">{lang==='ro'?'Șah contra calculatorului':'Chess vs computer'}</h1>
        <p className="page-sub">{lang==='ro'?'Tu joci cu albul. Calculatorul mută automat cu negrul.':'You play white. The computer plays black automatically.'}</p>
        <div className="craving-note">
          💚 {lang==='ro'?'Câteva mutări și dorința trece. Mintea ta e mai puternică decât crezi.':'A few moves and the urge passes. Your mind is stronger than you think.'}
        </div>
        {status && <div className="status-bar">{status}</div>}
        {thinking && !status && <div className="thinking-bar">⏳ {lang==='ro'?'Calculatorul se gândește...':'Computer is thinking...'}</div>}
        {!status && !thinking && (
          <div className="turn-bar">
            <div className="turn-dot" style={{background:'white', border:'1.5px solid #ccc'}}/>
            <span>{lang==='ro'?'Rândul tău — mută cu albul':'Your turn — move white'}</span>
          </div>
        )}
        <div style={{paddingLeft:20}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:-18,top:0,height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              {[8,7,6,5,4,3,2,1].map(n=><span key={n} style={{fontSize:9,color:'var(--text3)'}}>{n}</span>)}
            </div>
            <div className="chess-board">
              {board.map((row,r)=>row.map((piece,c)=>{
                const light=(r+c)%2===0
                const isSel=selected&&selected[0]===r&&selected[1]===c
                const isLegal=legalMoves.some(([lr,lc])=>lr===r&&lc===c)
                const isLastFrom=lastMove&&lastMove[0][0]===r&&lastMove[0][1]===c
                const isLastTo=lastMove&&lastMove[1][0]===r&&lastMove[1][1]===c
                return (
                  <div key={`${r}-${c}`}
                    className={`sq ${light?'light':'dark'} ${isSel?'selected':''} ${isLegal?'legal':''} ${isLegal&&piece!==' '?'has-piece':''} ${isLastFrom?'last-from':''} ${isLastTo?'last-to':''}`}
                    onClick={()=>handleClick(r,c)}>
                    {piece!==' '?PIECES[piece]:''}
                  </div>
                )
              }))}
            </div>
          </div>
          <div className="coords-row">{colNames.map(l=><span key={l}>{l}</span>)}</div>
        </div>
        {moves.length>0&&<div className="moves-log">{moves.map((m,i)=><p key={i}>{m}</p>)}</div>}
        <button className="reset-btn" onClick={reset}>{lang==='ro'?'Joc nou':'New game'}</button>
      </div>
    </>
  )
}
