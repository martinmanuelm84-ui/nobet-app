'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

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
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
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
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
              color: m.role === 'user' ? 'white' : 'var(--text)',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              padding: '0.875rem 1.125rem',
              borderRadius: 18,
              borderBottomRightRadius: m.role === 'user' ? 4 : 18,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 18,
              fontSize: '0.9rem',
              lineHeight: 1.65,
            }}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '0.875rem 1.125rem',
              borderRadius: 18,
              borderBottomLeftRadius: 4,
              fontSize: '0.9rem',
              color: 'var(--text3)',
            }}>...</div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{
          padding: '0.75rem 1.5rem 1rem',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          fontSize: '0.78rem',
          color: 'var(--text3)',
          textAlign: 'center',
        }}>
          🆘 {lang === 'ro' ? 'Criză acută? Sună' : 'Acute crisis? Call'} <strong>0800 070 070</strong> ({lang === 'ro' ? 'gratuit, 24/7' : 'free, 24/7'})
        </div>
        <div className="chat-input-bar">
          <textarea
            className="chat-input"
            placeholder={lang === 'ro' ? 'Scrie ce simți...' : 'Write what you feel...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1}
            style={{
              flex: 1,
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              background: 'var(--bg)',
              color: 'var(--text)',
              lineHeight: 1.5,
            }}
          />
          <button onClick={send} disabled={loading} style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: 'none',
            background: input.trim() ? 'var(--accent)' : 'var(--surface2)',
            color: input.trim() ? 'white' : 'var(--text3)',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
