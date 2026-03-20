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
      <div className="chat-wrap">
        <div className="chat-subheader">
          {lang === 'ro' ? 'VORBEȘTE CU CINEVA CARE ÎNȚELEGE.' : 'TALK TO SOMEONE WHO UNDERSTANDS.'}
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} style={{
              maxWidth: '82%',
              padding: '0.875rem 1.125rem',
              borderRadius: 18,
              fontSize: '0.9rem',
              lineHeight: 1.65,
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
              color: m.role === 'user' ? 'white' : 'var(--text)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border)',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              borderBottomRightRadius: m.role === 'user' ? 4 : 18,
              borderBottomLeftRadius: m.role === 'user' ? 18 : 4,
            }}>{m.content}</div>
          ))}
          {loading && <div style={{fontSize:'0.9rem',color:'var(--text3)',fontStyle:'italic'}}>...</div>}
          <div ref={bottomRef} />
        </div>
        <div style={{margin:'0 1.5rem 0.75rem',background:'var(--accent-light)',border:'1px solid var(--border)',borderRadius:10,padding:'0.6rem 1rem',fontSize:'0.78rem',color:'var(--text2)'}}>
          🆘 {lang === 'ro' ? 'Criză acută? Sună' : 'Crisis?'} <strong>0800 070 070</strong> (gratuit, 24/7)
        </div>
        <div className="chat-input-bar">
          <textarea
            className="chat-input"
            placeholder={lang === 'ro' ? 'Scrie ce simți...' : 'Write what you feel...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width:44,height:44,borderRadius:'50%',border:'none',
            background:'var(--accent)',color:'white',cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
            opacity: loading || !input.trim() ? 0.4 : 1
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
