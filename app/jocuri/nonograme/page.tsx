'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

type Puzzle = { name: string; nameEn: string; rows: number[][]; cols: number[][]; solution: number[][] }

const PUZZLES: Puzzle[] = [
  {
    name: 'Inima', nameEn: 'Heart',
    rows: [[2,2],[5],[5],[3],[1]],
    cols: [[1],[3],[5],[3],[5],[3],[1]],
    solution: [
      [0,1,0,1,0,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
    ]
  },
  {
    name: 'Casa', nameEn: 'House',
    rows: [[1],[3],[5],[1,1],[5]],
    cols: [[3],[2,1],[1,1,1],[2,1],[3]],
    solution: [
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,1,1,1,1],
      [1,0,1,0,1],
      [1,1,1,1,1],
    ]
  },
  {
    name: 'Stea', nameEn: 'Star',
    rows: [[1],[1,1],[5],[1,1],[1,1]],
    cols: [[1,1],[1,1],[5],[1,1],[1,1]],
    solution: [
      [0,0,1,0,0],
      [1,0,1,0,1],
      [1,1,1,1,1],
      [0,1,0,1,0],
      [1,0,1,0,1],
    ]
  },
]

export default function NonogramePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [grid, setGrid] = useState<number[][]>([])
  const [won, setWon] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const router = useRouter()
  const puzzle = PUZZLES[puzzleIdx]

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    setGrid(puzzle.solution.map(r => r.map(() => 0)))
    setWon(false)
    setMistakes(0)
  }, [puzzleIdx])

  const toggle = (r: number, c: number) => {
    if (won) return
    const ng = grid.map(row => [...row])
    if (ng[r][c] === 1) { ng[r][c] = 0 }
    else {
      ng[r][c] = 1
      if (puzzle.solution[r][c] !== 1) setMistakes(m => m + 1)
    }
    setGrid(ng)
    if (ng.every((row, ri) => row.every((cell, ci) => cell === puzzle.solution[ri][ci]))) setWon(true)
  }

  const reset = () => {
    setGrid(puzzle.solution.map(r => r.map(() => 0)))
    setWon(false)
    setMistakes(0)
  }

  if (!grid.length) return null

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .nono-wrap { max-width:480px; margin:0 auto; padding:2rem 1.5rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; margin-bottom:1.5rem; }
        .back-btn:hover { color:var(--accent); }
        .page-title { font-family:'Lora',serif; font-size:1.6rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
        .page-sub { font-size:0.82rem; color:var(--text2); margin-bottom:1.25rem; line-height:1.6; }
        .puzzle-select { display:flex; gap:8px; margin-bottom:1.5rem; flex-wrap:wrap; }
        .puz-btn { padding:6px 16px; border-radius:100px; border:1px solid var(--border); background:var(--surface); font-size:0.82rem; cursor:pointer; font-family:inherit; color:var(--text2); transition:all 0.15s; }
        .puz-btn.active { background:var(--accent); color:white; border-color:var(--accent); }
        .stats-row { display:flex; gap:12px; margin-bottom:1rem; }
        .stat-pill { background:var(--surface); border:1px solid var(--border); border-radius:100px; padding:5px 14px; font-size:0.8rem; color:var(--text2); }
        .stat-pill span { color:var(--accent); font-weight:600; }
        .won-banner { background:var(--accent-light); border:1px solid var(--accent); border-radius:12px; padding:1.25rem; text-align:center; margin-bottom:1rem; }
        .won-banner h3 { font-family:'Lora',serif; font-size:1.1rem; color:var(--accent); margin-bottom:0.3rem; }
        .nono-table { border-collapse:collapse; margin:0 auto 1.5rem; }
        .hint-top { width:36px; text-align:center; vertical-align:bottom; font-size:0.72rem; font-weight:600; color:var(--accent); padding:2px 0 4px; }
        .hint-left { text-align:right; vertical-align:middle; font-size:0.72rem; font-weight:600; color:var(--accent); padding-right:6px; white-space:nowrap; }
        .grid-cell { width:36px; height:36px; border:1px solid var(--border); cursor:pointer; transition:background 0.1s; }
        .grid-cell.filled { background:var(--accent); border-color:var(--accent); }
        .grid-cell.wrong { background:#ef4444; border-color:#ef4444; }
        .grid-cell:hover:not(.filled):not(.wrong) { background:var(--accent-light); }
        .reset-btn { width:100%; padding:0.7rem; border:none; border-radius:8px; background:var(--accent); color:white; font-size:0.85rem; cursor:pointer; font-family:inherit; font-weight:500; }
        .reset-btn:hover { opacity:0.85; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:1rem; font-size:0.8rem; color:var(--text2); line-height:1.6; margin-bottom:1.25rem; }
      `}</style>
      <div className="nono-wrap">
        <button className="back-btn" onClick={() => router.push('/jocuri')}>
          {lang === 'ro' ? '← Jocuri' : '← Games'}
        </button>
        <h1 className="page-title">Nonograme</h1>
        <p className="page-sub">
          {lang === 'ro'
            ? 'Colorează celulele după indicii numerice și descoperă imaginea ascunsă.'
            : 'Color cells according to numerical clues and reveal the hidden image.'}
        </p>
        <div className="craving-note">
          💚 {lang === 'ro' ? 'Concentrează-te pe grilă. Câteva minute și dorința trece.' : 'Focus on the grid. A few minutes and the urge passes.'}
        </div>
        <div className="puzzle-select">
          {PUZZLES.map((p, i) => (
            <button key={i} className={`puz-btn ${puzzleIdx === i ? 'active' : ''}`} onClick={() => setPuzzleIdx(i)}>
              {lang === 'ro' ? p.name : p.nameEn}
            </button>
          ))}
        </div>
        <div className="stats-row">
          <div className="stat-pill">{lang === 'ro' ? 'Greșeli' : 'Mistakes'}: <span>{mistakes}</span></div>
          <div className="stat-pill">Puzzle: <span>{lang === 'ro' ? puzzle.name : puzzle.nameEn}</span></div>
        </div>
        {won && (
          <div className="won-banner">
            <h3>🎉 {lang === 'ro' ? 'Ai descoperit imaginea!' : 'You revealed the image!'}</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text2)'}}>
              {lang === 'ro' ? 'Încearcă următorul puzzle.' : 'Try the next puzzle.'}
            </p>
          </div>
        )}
        <table className="nono-table">
          <thead>
            <tr>
              <td></td>
              {puzzle.cols.map((col, ci) => (
                <td key={ci} className="hint-top">
                  {col.map((n, i) => <div key={i}>{n}</div>)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                <td className="hint-left">{puzzle.rows[ri].join(' ')}</td>
                {row.map((cell, ci) => {
                  const isWrong = cell === 1 && puzzle.solution[ri][ci] !== 1
                  return (
                    <td key={ci}
                      className={`grid-cell ${cell === 1 && !isWrong ? 'filled' : ''} ${isWrong ? 'wrong' : ''}`}
                      onClick={() => toggle(ri, ci)}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="reset-btn" onClick={reset}>
          {lang === 'ro' ? 'Resetează' : 'Reset'}
        </button>
      </div>
    </>
  )
}
