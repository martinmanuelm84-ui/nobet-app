'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Lang } from '@/lib/i18n'

export default function CrisisButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [seconds, setSeconds] = useState(60)
  const [phase, setPhase] = useState<'wait'|'done'>('wait')
  const [playing, setPlaying] = useState<'lenta'|'rock'|null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) { setSeconds(60); setPhase('wait'); stopAudio(); return }
    if (phase !== 'wait') return
    if (seconds <= 0) { setPhase('done'); return }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [open, seconds, phase])

  const stopAudio = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setPlaying(null)
  }

  const toggleAudio = (type: 'lenta' | 'rock') => {
    if (playing === type) { stopAudio(); return }
    audioRef.current?.pause()
    const audio = new Audio(`/audio/melodie-${type}.mp3`)
    audio.loop = true
    audio.play()
    audioRef.current = audio
    setPlaying(type)
  }

  const close = () => { setOpen(false); setSeconds(60); setPhase('wait'); stopAudio() }
  const ro = lang === 'ro'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&display=swap');
        .crisis-fab { position:fixed; top:70px; left:16px; z-index:999; background:#dc2626; color:white; border:none; border-radius:50%; width:72px; height:72px; padding:0; font-size:0.6rem; font-weight:800; letter-spacing:1px; text-align:center; line-height:1.2; flex-direction:column; cursor:pointer; box-shadow:0 4px 16px rgba(220,38,38,0.45); display:flex; align-items:center; justify-content:center; transition:transform 0.2s,box-shadow 0.2s; }
        .crisis-fab:hover { transform:scale(1.08); box-shadow:0 6px 24px rgba(220,38,38,0.55); }
        .crisis-fab .pulse { width:10px; height:10px; background:white; border-radius:50%; animation:pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .crisis-overlay { position:fixed; inset:0; z-index:1000; background:#0f1a0f; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; animation:fadeIn 0.3s ease; overflow-y:auto; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .crisis-inner { max-width:480px; width:100%; text-align:center; }
        .crisis-stop { font-family:'Lora',serif; font-size:clamp(2rem,8vw,3.5rem); color:white; font-weight:600; margin-bottom:0.5rem; line-height:1.1; }
        .crisis-sub { font-size:clamp(1rem,3vw,1.3rem); color:rgba(255,255,255,0.7); font-style:italic; font-family:'Lora',serif; margin-bottom:2rem; }
        .timer-ring { width:120px; height:120px; margin:0 auto 1.5rem; position:relative; }
        .timer-ring svg { transform:rotate(-90deg); }
        .timer-ring .bg { fill:none; stroke:rgba(255,255,255,0.1); stroke-width:6; }
        .timer-ring .progress { fill:none; stroke:#4ade80; stroke-width:6; stroke-linecap:round; transition:stroke-dashoffset 1s linear; }
        .timer-num { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-family:'Lora',serif; font-size:2.2rem; font-weight:600; color:white; }
        .crisis-message { font-size:0.95rem; color:rgba(255,255,255,0.6); margin-bottom:1.5rem; line-height:1.7; }
        .crisis-message strong { color:rgba(255,255,255,0.9); }
        .audio-row { display:flex; gap:10px; margin-bottom:1.5rem; }
        .audio-btn { flex:1; padding:0.75rem 0.5rem; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.06); color:white; font-size:0.85rem; font-family:inherit; cursor:pointer; transition:all 0.2s; }
        .audio-btn.active { background:rgba(74,222,128,0.2); border-color:#4ade80; color:#4ade80; }
        .audio-btn:hover { background:rgba(255,255,255,0.12); }
        .options-grid { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:2rem; }
        .option-btn { padding:1rem 1.5rem; border-radius:14px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); color:white; font-size:0.95rem; font-family:inherit; cursor:pointer; transition:all 0.2s; text-align:left; display:flex; align-items:center; gap:14px; }
        .option-btn:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.3); transform:translateX(4px); }
        .option-icon { font-size:1.4rem; flex-shrink:0; }
        .option-text strong { display:block; font-weight:600; margin-bottom:2px; }
        .option-text span { font-size:0.82rem; opacity:0.65; }
        .done-message { font-family:'Lora',serif; font-size:1.4rem; color:#4ade80; margin-bottom:1rem; font-style:italic; }
        .done-sub { font-size:0.9rem; color:rgba(255,255,255,0.6); margin-bottom:2rem; line-height:1.7; }
        .close-btn { padding:0.75rem 2rem; border-radius:100px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.5); font-size:0.85rem; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .close-btn:hover { color:white; border-color:rgba(255,255,255,0.4); }
      `}</style>

      <button className="crisis-fab" onClick={() => setOpen(true)} title={ro ? 'AM POFTĂ SĂ JOC' : 'PANIC BUTTON'}>
        <span className="pulse"></span>
        PANIC BUTTON
      </button>

      {open && (
        <div className="crisis-overlay">
          <div className="crisis-inner">
            {phase === 'wait' ? (
              <>
                <div className="crisis-stop">{ro ? 'Stai.' : 'Wait.'}</div>
                <div className="crisis-sub">{ro ? 'Nu decide acum.' : "Don't decide now."}</div>

                <div className="timer-ring">
                  <svg viewBox="0 0 120 120" width="120" height="120">
                    <circle className="bg" cx="60" cy="60" r="54"/>
                    <circle className="progress" cx="60" cy="60" r="54"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - seconds / 60)}`}
                    />
                  </svg>
                  <div className="timer-num">{seconds}</div>
                </div>

                <p className="crisis-message">
                  {ro
                    ? <><strong>60 de secunde.</strong> Atât e craving-ul la vârf. Ascultă ceva până trece.</>
                    : <><strong>60 seconds.</strong> That's how long a craving peaks. Listen to something until it passes.</>
                  }
                </p>

                <div className="audio-row">
                  <button className={`audio-btn ${playing === 'lenta' ? 'active' : ''}`} onClick={() => toggleAudio('lenta')}>
                    {playing === 'lenta' ? '⏸' : '▶'} {ro ? 'Liniște' : 'Calm'}
                  </button>
                  <button className={`audio-btn ${playing === 'rock' ? 'active' : ''}`} onClick={() => toggleAudio('rock')}>
                    {playing === 'rock' ? '⏸' : '▶'} {ro ? 'Energie' : 'Energy'}
                  </button>
                </div>

                <div className="options-grid">
                  <button className="option-btn" onClick={() => { close(); router.push('/jocuri') }}>
                    <span className="option-icon">🎮</span>
                    <span className="option-text">
                      <strong>{ro ? 'Joacă ceva rapid' : 'Play something quick'}</strong>
                      <span>{ro ? 'Sudoku, 2048 sau șah — fără noroc' : 'Sudoku, 2048 or chess — no luck'}</span>
                    </span>
                  </button>
                  <button className="option-btn" onClick={() => { close(); router.push('/companion') }}>
                    <span className="option-icon">💬</span>
                    <span className="option-text">
                      <strong>{ro ? 'Vorbește cu cineva' : 'Talk to someone'}</strong>
                      <span>{ro ? 'Antrenorul tău e disponibil acum' : 'Your coach is available now'}</span>
                    </span>
                  </button>
                  <button className="option-btn" onClick={() => {
                    const msg = ro
                      ? 'Respiră adânc de 4 ori: inspiră 4 secunde, ține 4, expiră 4.'
                      : 'Take 4 deep breaths: inhale 4 seconds, hold 4, exhale 4.'
                    alert(msg)
                  }}>
                    <span className="option-icon">🌬️</span>
                    <span className="option-text">
                      <strong>{ro ? 'Respiră' : 'Breathe'}</strong>
                      <span>{ro ? 'Exercițiu de respirație 4-4-4' : '4-4-4 breathing exercise'}</span>
                    </span>
                  </button>
                </div>

                <button className="close-btn" onClick={close}>
                  {ro ? 'Închide' : 'Close'}
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:'3rem', marginBottom:'1rem'}}>💚</div>
                <div className="done-message">{ro ? 'Ai rezistat.' : 'You resisted.'}</div>
                <p className="done-sub">
                  {ro
                    ? '60 de secunde au trecut. Craving-ul a trecut cu tine. Asta e o victorie reală.'
                    : "60 seconds passed. The craving passed with you. That's a real victory."}
                </p>
                <button className="close-btn" style={{color:'#4ade80', borderColor:'#4ade80'}} onClick={close}>
                  {ro ? 'Continuă' : 'Continue'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
