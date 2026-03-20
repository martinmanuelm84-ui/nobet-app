'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

type Message = { role: 'user' | 'assistant'; content: string }

export default function CompanionPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Sunt aici. Ia-ți timp.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('nobet_lang') as Lang
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const newMessages: Message[] = [...messages, { role: 'user', content: input }]
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
      <Nav lang={lang} onLangChange={setLang} />
      <style>{`
        .companion-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 56px);
          max-width: 640px;
          margin: 0 auto;
        }
        .companion-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .companion-header h2 {
          font-size: 0.72rem;
          color: var(--text3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .companion-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .msg {
          max-width: 82%;
          padding: 0.875rem 1.125rem;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        .msg.assistant {
          background: var(--surface);
          border: 1px solid var(--border);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .msg.user {
          background: var(--accent);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .msg.typing { opacity: 0.5; font-style: italic; }
        .crisis-note {
          margin: 0 1.5rem 0.75rem;
          background: var(--accent-light);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          font-size: 0.78rem;
          color: var(--text2);
          flex-shrink: 0;
        }
        .companion-input {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .companion-input textarea {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-family: inherit;
          resize: none;
          outline: none;
          background: var(--bg);
          color: var(--text);
          line-height: 1.5;
          height: 44px;
        }
        .companion-input textarea:focus { border-color: var(--accent); }
        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--accent);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .send-btn:hover { opacity: 0.85; }
        .send-btn:disabled { opacity: 0.4; }
      `}</style>
      <div className="companion-page">
        <div className="companion-header">
          <h2>{lang === 'ro' ? 'VORBEȘTE CU CINEVA CARE ÎNȚELEGE.' : 'TALK TO SOMEONE WHO UNDERSTANDS.'}</h2>
        </div>
        <div className="companion-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>{m.content}</div>
          ))}
          {loading && <div className="msg assistant typing">...</div>}
          <div ref={bottomRef} />
        </div>
        <div className="crisis-note">
          🆘 {lang === 'ro' ? 'Criză acută? Sună' : 'Acute crisis? Call'} <strong>0800 070 070</strong> ({lang === 'ro' ? 'gratuit, 24/7' : 'free, 24/7'})
        </div>
        <div className="companion-input">
          <textarea
            placeholder={lang === 'ro' ? 'Scrie ce simți...' : 'Write what you feel...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
