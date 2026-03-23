'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

export default function MuzicaPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [playing, setPlaying] = useState<'lenta' | 'rock' | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  const stopAudio = () => {
    audioRef.current?.pause()
    audioRef.current = null
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPlaying(null)
    setSeconds(0)
    setDuration(0)
  }

  const toggleAudio = (type: 'lenta' | 'rock') => {
    if (playing === type) { stopAudio(); return }
    stopAudio()
    const audio = new Audio(`/audio/melodie-${type}.mp3`)
    audio.loop = true
    audio.addEventListener('loadedmetadata', () => setDuration(Math.floor(audio.duration)))
    audio.play()
    audioRef.current = audio
    setPlaying(type)
    setSeconds(0)
    intervalRef.current = setInterval(() => {
      setSeconds(Math.floor(audio.currentTime))
    }, 1000)
  }

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
  const ro = lang === 'ro'

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&display=swap');
        .muz-wrap { max-width:480px; margin:0 auto; padding:2rem 1.5rem 6rem; }
        .muz-title { font-family:'Lora',serif; font-size:1.6rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
        .muz-sub { font-size:0.85rem; color:var(--text3); margin-bottom:2rem; }
        .muz-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.5rem; margin-bottom:1rem; cursor:pointer; transition:all 0.2s; }
        .muz-card:hover { border-color:var(--accent); }
        .muz-card.active { border-color:var(--accent); background:var(--accent-light); }
        .muz-card-top { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
        .muz-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; background:var(--accent-light); flex-shrink:0; }
        .muz-card.active .muz-icon { background:var(--accent); }
        .muz-name { font-weight:600; font-size:1rem; color:var(--text); margin-bottom:2px; }
        .muz-desc { font-size:0.8rem; color:var(--text3); }
        .muz-play { margin-left:auto; width:40px; height:40px; border-radius:50%; background:var(--accent); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .muz-progress { height:4px; background:var(--border); border-radius:2px; overflow:hidden; margin-bottom:0.5rem; }
        .muz-progress-bar { height:100%; background:var(--accent); border-radius:2px; transition:width 1s linear; }
        .muz-time { display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text3); }
        .muz-info { background:var(--accent-light); border:1px solid var(--border); border-radius:12px; padding:1rem 1.25rem; font-size:0.82rem; color:var(--text2); line-height:1.7; margin-top:1.5rem; }
      `}</style>
      <div className="muz-wrap">
        <div className="muz-title">{ro ? 'Muzică pentru craving' : 'Music for craving'}</div>
        <div className="muz-sub">{ro ? 'Ascultă când simți nevoia să joci. Dă-ți 2 minute.' : 'Listen when you feel the urge. Give yourself 2 minutes.'}</div>

        {(['lenta', 'rock'] as const).map(type => (
          <div key={type} className={`muz-card ${playing === type ? 'active' : ''}`} onClick={() => toggleAudio(type)}>
            <div className="muz-card-top">
              <div className="muz-icon">{type === 'lenta' ? '🎵' : '⚡'}</div>
              <div>
                <div className="muz-name">{type === 'lenta' ? (ro ? 'Liniște' : 'Calm') : (ro ? 'Energie' : 'Energy')}</div>
                <div className="muz-desc">{type === 'lenta' ? (ro ? 'Bol tibetan, pian, ploaie — ancorare' : 'Tibetan bowl, piano, rain — grounding') : (ro ? 'Rock instrumental — resetare prin contrast' : 'Instrumental rock — reset through contrast')}</div>
              </div>
              <button className="muz-play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  {playing === type ? <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></> : <polygon points="5,3 19,12 5,21"/>}
                </svg>
              </button>
            </div>
            {playing === type && (
              <>
                <div className="muz-progress">
                  <div className="muz-progress-bar" style={{width: duration ? `${(seconds/duration)*100}%` : '0%'}}/>
                </div>
                <div className="muz-time">
                  <span>{fmt(seconds)}</span>
                  <span>{duration ? fmt(duration) : '--:--'}</span>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="muz-info">
          💡 {ro ? 'Craving-ul durează în medie 60-90 de secunde la vârf. Muzica te ajută să treci peste acest moment fără să acționezi impulsiv.' : 'A craving peaks for about 60-90 seconds on average. Music helps you get through this moment without acting impulsively.'}
        </div>
      </div>
    </>
  )
}
