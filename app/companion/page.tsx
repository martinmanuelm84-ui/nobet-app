'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Record<Lang, string> = {
  ro: 'Sunt aici. Ia-ți timp.',
  en: 'I\'m here. Take your time.',
}

export default function CompanionPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    const l = savedLang || 'ro'
    setLang(l)
    setMessages([{ role: 'assistant', content: WELCOME[l] }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: '...' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav lang={lang} onLangChange={(l) => {
        setLang(l)
        setMessages([{ role: 'assistant', content: WELCOME[l] }])
      }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');
        .chat-wrap { max-width:640px; margin:0 auto; display:flex; flex-direction:column; height:calc(100vh - 56px); overflow:hidden; max-width:640px; margin:0 auto; }
        .chat-header { padding:1rem 1.5rem; border-bottom:1px solid var(--border); background:var(--surface); }
        .chat-header h2 { font-family:'Lora',serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:2px; }
        .chat-header p { font-size:0.78rem; color:var(--text3); }
        .chat-messages { flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
        .msg { max-width:82%; padding:0.875rem 1.125rem; border-radius:18px; font-size:0.9rem; line-height:1.65; }
        .msg.assistant { background:var(--surface); border:1px solid var(--border); color:var(--text); border-bottom-left-radius:4px; align-self:flex-start; }
        .msg.user { background:var(--accent); color:white; border-bottom-right-radius:4px; align-self:flex-end; }
        .msg.loading { opacity:0.5; font-style:italic; }
        .chat-input { padding:1rem 1.5rem; background:var(--surface); border-top:1px solid var(--border); display:flex; gap:0.75rem; }
        .chat-input textarea { flex:1; border:1px solid var(--border); border-radius:12px; padding:0.75rem 1rem; font-size:0.9rem; font-family:inherit; resize:none; outline:none; background:var(--bg); color:var(--text); line-height:1.5; }
        .chat-input textarea:focus { border-color:var(--accent); }
        .send-btn { width:44px; height:44px; border-radius:12px; background:var(--accent); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:opacity 0.2s; align-self:flex-end; }
        .send-btn:hover { opacity:0.85; }
        .send-btn:disabled { opacity:0.4; cursor:default; }
        .crisis-note { margin:0 1.5rem 1rem; background:var(--accent-light); border:1px solid var(--border); border-radius:10px; padding:0.75rem 1rem; font-size:0.78rem; color:var(--text2); line-height:1.6; }
      `}</style>
      <div className="chat-wrap">
        <div className="chat-header">
          <h2>{lang === 'ro' ? 'Suport NoBet' : 'NoBet Support'}</h2>
          <p>{lang === 'ro' ? 'Confidențial · Disponibil oricând · Fără judecată' : 'Confidential · Always available · No judgment'}</p>
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>{m.content}</div>
          ))}
          {loading && <div className="msg assistant loading">…</div>}
          <div ref={bottomRef} />
        </div>
        <div className="crisis-note">
          🆘 {lang === 'ro'
            ? 'Criză acută? Sună 0800 070 070 (gratuit, 24/7) sau folosește butonul roșu.'
            : 'Acute crisis? Call 0800 070 070 (free, 24/7) or use the red button.'}
        </div>
        <div className="chat-input">
          <textarea
            rows={2}
            placeholder={lang === 'ro' ? 'Scrie ce simți...' : 'Write what you feel...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
