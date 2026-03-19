'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const PUZZLE: (number|null)[][] = [
  [5,3,null,null,7,null,null,null,null],
  [6,null,null,1,9,5,null,null,null],
  [null,9,8,null,null,null,null,6,null],
  [8,null,null,null,6,null,null,null,3],
  [4,null,null,8,null,3,null,null,1],
  [7,null,null,null,2,null,null,null,6],
  [null,6,null,null,null,null,2,8,null],
  [null,null,null,4,1,9,null,null,5],
  [null,null,null,null,8,null,null,7,9],
]

const SOLUTION: number[][] = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
]

export default function SudokuPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [board, setBoard] = useState<(number|null)[][]>(PUZZLE.map(r => [...r]))
  const [selected, setSelected] = useState<[number,number]|null>(null)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [won, setWon] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  const isFixed = (r: number, c: number) => PUZZLE[r][c] !== null

  const handleInput = (val: number) => {
    if (!selected) return
    const [r, c] = selected
    if (isFixed(r, c)) return
    const newBoard = board.map(row => [...row])
    newBoard[r][c] = val
    const newErrors = new Set<string>()
    newBoard.forEach((row, ri) => row.forEach((cell, ci) => {
      if (cell !== null && cell !== SOLUTION[ri][ci]) newErrors.add(`${ri}-${ci}`)
    }))
    setErrors(newErrors)
    setBoard(newBoard)
    const complete = newBoard.every((row, ri) => row.every((cell, ci) => cell === SOLUTION[ri][ci]))
    if (complete) setWon(true)
  }

  const reset = () => {
    setBoard(PUZZLE.map(r => [...r]))
    setErrors(new Set())
    setSelected(null)
    setWon(false)
  }

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .sudoku-wrap { max-width: 480px; margin: 0 auto; padding: 2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; text-decoration:none; margin-bottom:1.5rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; }
        .back-btn:hover { color:var(--accent); }
        .page-title { font-family:'Lora',serif; font-size:1.75rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
        .page-sub { font-size:0.875rem; color:var(--text2); margin-bottom:1.75rem; }
        .grid { display:grid; grid-template-columns:repeat(9,1fr); border:2px solid var(--accent); border-radius:8px; overflow:hidden; margin-bottom:1.5rem; }
        .cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:500; cursor:pointer; border:0.5px solid var(--border); background:var(--surface); color:var(--text); transition:background 0.1s; user-select:none; }
        .cell.fixed { color:var(--text); font-weight:600; }
        .cell.selected { background:var(--accent-light); }
        .cell.error { color:#dc2626; background:#fef2f2; }
        .cell.same-num { background:#f0f7f3; }
        .cell.border-right { border-right:2px solid var(--accent); }
        .cell.border-bottom { border-bottom:2px solid var(--accent); }
        .numpad { display:grid; grid-template-columns:repeat(9,1fr); gap:6px; margin-bottom:1rem; }
        .num-btn { aspect-ratio:1; border:1px solid var(--border); border-radius:8px; background:var(--surface); font-size:1rem; font-weight:500; cursor:pointer; color:var(--text); transition:all 0.15s; font-family:inherit; display:flex; align-items:center; justify-content:center; }
        .num-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-light); }
        .erase-btn { width:100%; padding:0.7rem; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text2); font-size:0.85rem; cursor:pointer; font-family:inherit; margin-bottom:0.75rem; transition:all 0.15s; }
        .erase-btn:hover { border-color:var(--accent); color:var(--accent); }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; transition:opacity 0.2s; }
        .reset-btn:hover { opacity:0.85; }
        .won-banner { background:var(--accent); color:white; border-radius:12px; padding:1.5rem; text-align:center; margin-bottom:1.5rem; }
        .won-banner h2 { font-family:'Lora',serif; font-size:1.4rem; margin-bottom:0.5rem; }
        .won-banner p { font-size:0.9rem; opacity:0.85; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.6; margin-bottom:1.5rem; }
      `}</style>
      <div className="sudoku-wrap">
        <button className="back-btn" onClick={() => router.push('/home')}>← {lang === 'ro' ? 'Înapoi' : 'Back'}</button>
        <h1 className="page-title">Sudoku</h1>
        <p className="page-sub">{lang === 'ro' ? 'Completează grila. Fiecare rând, coloană și bloc 3×3 trebuie să conțină cifrele 1–9.' : 'Fill the grid. Each row, column and 3×3 block must contain digits 1–9.'}</p>
        <div className="craving-note">
          💚 {lang === 'ro' ? 'Stai cu noi câteva minute. Dorința trece — tu rămâi.' : 'Stay with us a few minutes. The urge passes — you stay.'}
        </div>
        {won && (
          <div className="won-banner">
            <h2>🎉 {lang === 'ro' ? 'Ai reușit!' : 'You did it!'}</h2>
            <p>{lang === 'ro' ? 'Ai completat grila. Asta e o victorie reală.' : 'You completed the grid. That\'s a real win.'}</p>
          </div>
        )}
        <div className="grid">
          {board.map((row, r) => row.map((cell, c) => {
            const sel = selected && selected[0] === r && selected[1] === c
            const err = errors.has(`${r}-${c}`)
            const sameNum = selected && board[selected[0]][selected[1]] !== null && cell === board[selected[0]][selected[1]] && !sel
            const borderRight = (c === 2 || c === 5)
            const borderBottom = (r === 2 || r === 5)
            return (
              <div key={`${r}-${c}`}
                className={`cell ${isFixed(r,c)?'fixed':''} ${sel?'selected':''} ${err?'error':''} ${sameNum?'same-num':''} ${borderRight?'border-right':''} ${borderBottom?'border-bottom':''}`}
                onClick={() => !won && setSelected([r,c])}>
                {cell || ''}
              </div>
            )
          }))}
        </div>
        <div className="numpad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="num-btn" onClick={() => handleInput(n)}>{n}</button>
          ))}
        </div>
        <button className="erase-btn" onClick={() => { if(selected && !isFixed(selected[0],selected[1])) { const b=board.map(r=>[...r]); b[selected[0]][selected[1]]=null; setBoard(b); } }}>
          ✕ {lang === 'ro' ? 'Șterge' : 'Erase'}
        </button>
        <button className="reset-btn" onClick={reset}>{lang === 'ro' ? 'Grilă nouă' : 'New grid'}</button>
      </div>
    </>
  )
}
