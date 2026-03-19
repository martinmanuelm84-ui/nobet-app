'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

const WORDS_RO = ['CARTE','IARNA','VERDE','FORTA','MUNCA','VIATA','SOMN','BUCUR','CREDE','LUPTA','MINTE','SUFLE','SOARE','VREME','NOROC','JOCUL','GANDF','PASUL','DRUMUL','FINAL']
const WORDS_RO_5 = ['CARTE','IARNA','VERDE','FORTA','MUNCA','VIATA','SOMN1','BUCUR','CREDE','LUPTA','MINTE','SUFLE','SOARE','VREME','NOROC','JOCUL','PASUL','DRUM1','FINAL','PRIMA','LIBER','PUTEA','SEMNE','LUMEA','SANSE','TARIA','VINTA','MERGE','CRIZA','NOAPT']
const WORDS5 = ['CARTE','IARNA','VERDE','FORTE','MUNCA','VIATA','SOMNN','BUCUR','CREDE','LUPTA','MINTE','SUFLE','SOARE','VREME','NOROC','JOCUL','PASUL','DRUMM','FINAL','PRIMA','LIBER','PUTEA','SEMNE','LUMEA','SANSE','TARIA','VINTE','MERGE','CRIZA','NOAPT']
const WORDS_EN = ['BRAVE','HEART','CHESS','PEACE','LIGHT','THINK','WATER','CLIMB','TRUST','LEARN','FOCUS','POWER','DREAM','BLOOM','CRAFT','TRAIL','GRIND','QUIET','PILOT','SPARK']

function getTodayWord(lang: string): string {
  const words = lang === 'ro' ? WORDS5 : WORDS_EN
  const day = Math.floor(Date.now() / 86400000)
  return words[day % words.length]
}

const ALPHA_RO = 'AĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ'
const ALPHA_EN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export default function CuvantPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [target, setTarget] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    const l = savedLang || 'ro'
    setLang(l)
    setTarget(getTodayWord(l))
  }, [])

  useEffect(() => { setTarget(getTodayWord(lang)) }, [lang])

  const getStates = (guess: string): LetterState[] => {
    const result: LetterState[] = Array(5).fill('absent')
    const targetArr = target.split('')
    const used = Array(5).fill(false)
    guess.split('').forEach((l, i) => { if(l === targetArr[i]) { result[i] = 'correct'; used[i] = true } })
    guess.split('').forEach((l, i) => {
      if(result[i] === 'correct') return
      const j = targetArr.findIndex((t, ti) => t === l && !used[ti])
      if(j !== -1) { result[i] = 'present'; used[j] = true }
    })
    return result
  }

  const letterMap: Record<string, LetterState> = {}
  guesses.forEach(g => {
    getStates(g).forEach((s, i) => {
      const l = g[i]
      if(!letterMap[l] || s === 'correct' || (s === 'present' && letterMap[l] === 'absent')) letterMap[l] = s
    })
  })

  const submit = () => {
    if(current.length < 5) { setShake(true); setTimeout(()=>setShake(false),500); return }
    const newGuesses = [...guesses, current]
    setGuesses(newGuesses)
    setCurrent('')
    if(current === target) { setWon(true); setGameOver(true) }
    else if(newGuesses.length >= 6) { setGameOver(true) }
  }

  const onKey = (k: string) => {
    if(gameOver) return
    if(k === 'ENTER') { submit(); return }
    if(k === 'DEL' || k === 'ȘTERG') { setCurrent(c => c.slice(0,-1)); return }
    if(current.length < 5 && /^[A-ZĂÂÎȘȚ]$/.test(k)) setCurrent(c => c+k)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if(k === 'ENTER') onKey('ENTER')
      else if(k === 'BACKSPACE') onKey('DEL')
      else if(/^[A-ZĂÂÎȘȚ]$/.test(k)) onKey(k)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, gameOver])

  const colors: Record<LetterState, string> = {
    correct: 'var(--accent)',
    present: '#d4a017',
    absent: '#6b6b6b',
    empty: 'transparent',
    tbd: 'transparent',
  }
  const textColors: Record<LetterState, string> = {
    correct: 'white', present: 'white', absent: 'white', empty: 'var(--text)', tbd: 'var(--text)',
  }

  const rows = Array(6).fill(null).map((_, i) => {
    if(i < guesses.length) return { letters: guesses[i].split(''), states: getStates(guesses[i]), submitted: true }
    if(i === guesses.length && !gameOver) return { letters: current.padEnd(5,' ').split(''), states: Array(5).fill('tbd') as LetterState[], submitted: false }
    return { letters: Array(5).fill(' '), states: Array(5).fill('empty') as LetterState[], submitted: false }
  })

  const alpha = lang === 'ro' ? ALPHA_RO : ALPHA_EN
  const rows_kb = lang === 'ro'
    ? [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','ȘTERG']]
    : [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','DEL']]

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&display=swap');
        .cuvant-wrap { max-width:420px; margin:0 auto; padding:1.5rem 1rem 3rem; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:var(--text2); font-size:0.85rem; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; margin-bottom:1rem; }
        .back-btn:hover { color:var(--accent); }
        .page-title { font-family:'Lora',serif; font-size:1.6rem; font-weight:600; color:var(--text); margin-bottom:0.2rem; }
        .page-sub { font-size:0.82rem; color:var(--text2); margin-bottom:1rem; }
        .grid { display:flex; flex-direction:column; gap:6px; margin-bottom:1.25rem; }
        .grid-row { display:flex; gap:6px; justify-content:center; }
        .grid-row.shake { animation:shake 0.4s; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .tile { width:52px; height:52px; border:2px solid var(--border); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:700; text-transform:uppercase; transition:background 0.2s,border-color 0.2s; }
        .tile.tbd { border-color:var(--text3); }
        .kb { display:flex; flex-direction:column; gap:6px; margin-bottom:1rem; }
        .kb-row { display:flex; gap:4px; justify-content:center; }
        .kb-btn { min-width:30px; height:44px; padding:0 6px; border:none; border-radius:6px; background:var(--surface2); color:var(--text); font-size:0.78rem; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.15s,color 0.15s; }
        .kb-btn:hover { opacity:0.85; }
        .kb-btn.wide { min-width:52px; font-size:0.7rem; }
        .banner { border-radius:12px; padding:1rem 1.25rem; text-align:center; margin-bottom:1rem; }
        .banner.won { background:var(--accent-light); border:1px solid var(--accent); }
        .banner.lost { background:#fef2f2; border:1px solid #fca5a5; }
        .banner h3 { font-family:'Lora',serif; font-size:1.1rem; margin-bottom:0.3rem; }
        .craving-note { background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:0.875rem 1rem; font-size:0.8rem; color:var(--text2); line-height:1.6; margin-bottom:1rem; }
        .new-game-note { font-size:0.78rem; color:var(--text3); text-align:center; margin-top:0.5rem; }
      `}</style>
      <div className="cuvant-wrap">
        <button className="back-btn" onClick={()=>router.push('/jocuri')}>← {lang==='ro'?'Jocuri':'Games'}</button>
        <h1 className="page-title">{lang==='ro'?'Cuvântul zilei':'Word of the day'}</h1>
        <p className="page-sub">{lang==='ro'?'Ghicește cuvântul de 5 litere în 6 încercări. 🟩 = litera corectă, 🟨 = litera există dar altundeva.':'Guess the 5-letter word in 6 tries. 🟩 = correct letter, 🟨 = letter exists but wrong position.'}</p>
        <div className="craving-note">💚 {lang==='ro'?'Rămâi cu noi. Dorința trece până rezolvi cuvântul.':'Stay with us. The urge will pass before you solve the word.'}</div>
        {won && <div className="banner won"><h3>🎉 {lang==='ro'?'Ai ghicit!':'You got it!'}</h3><p style={{fontSize:'0.85rem'}}>{lang==='ro'?`Cuvântul era ${target}. Revino mâine pentru un cuvânt nou.`:`The word was ${target}. Come back tomorrow for a new word.`}</p></div>}
        {gameOver && !won && <div className="banner lost"><h3>{lang==='ro'?'Mâine e o nouă șansă':'Tomorrow is a new chance'}</h3><p style={{fontSize:'0.85rem',color:'#6b6b6b'}}>{lang==='ro'?`Cuvântul era: ${target}`:`The word was: ${target}`}</p></div>}
        <div className="grid">
          {rows.map((row, i) => (
            <div key={i} className={`grid-row ${i===guesses.length&&shake?'shake':''}`}>
              {row.letters.map((letter, j) => (
                <div key={j} className={`tile ${row.states[j]}`}
                  style={{
                    background: row.submitted ? colors[row.states[j]] : 'var(--surface)',
                    borderColor: row.submitted ? colors[row.states[j]] : row.states[j]==='tbd'&&letter.trim() ? 'var(--text2)' : 'var(--border)',
                    color: row.submitted ? textColors[row.states[j]] : 'var(--text)',
                  }}>
                  {letter.trim()}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="kb">
          {rows_kb.map((row, i) => (
            <div key={i} className="kb-row">
              {row.map(k => (
                <button key={k} className={`kb-btn ${k.length>1?'wide':''}`}
                  style={{
                    background: letterMap[k] ? colors[letterMap[k]] : 'var(--surface2)',
                    color: letterMap[k] ? 'white' : 'var(--text)',
                  }}
                  onClick={()=>onKey(k)}>{k}</button>
              ))}
            </div>
          ))}
        </div>
        <p className="new-game-note">{lang==='ro'?'Cuvânt nou în fiecare zi la miezul nopții.':'New word every day at midnight.'}</p>
      </div>
    </>
  )
}
