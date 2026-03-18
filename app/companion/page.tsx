'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

type Message = { role: 'user' | 'assistant'; content: string }

const SYSTEM = `Ești un companion calm și direct pentru cineva care se recuperează din dependența de jocuri de noroc. Ai fost creat pe baza experienței reale a cuiva care a trecut prin asta. Vorbești simplu, fără judecată, fără discursuri motivaționale. Nu ești terapeut. Ești prezent. Răspunzi scurt (2-4 propoziții), în aceeași limbă în care ți se vorbește.`

export default function CompanionPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const tr = t[lang].companion

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    setMessages([{ role: 'assistant', content: tr.welcome }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, system: SYSTEM }),
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
        <div className="chat-subheader">{tr.subtitle}</div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%',
                padding: '0.875rem 1.125rem',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                fontSize: '0.92rem',
                lineHeight: 1.6,
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div>
              <div style={{
                display: 'inline-block',
                padding: '0.875rem 1.125rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px 16px 16px 4px',
                fontSize: '0.88rem',
                color: 'var(--text3)',
              }}>{tr.thinking}</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-bar">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={tr.placeholder}
            style={{
              flex: 1, padding: '0.75rem 1rem',
              border: '1px solid var(--border)', borderRadius: '8px',
              fontSize: '0.92rem', background: 'var(--bg)',
              color: 'var(--text)', outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: '8px',
              background: input.trim() ? 'var(--accent)' : 'var(--surface2)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              color: input.trim() ? '#fff' : 'var(--text3)',
              fontSize: '1rem', transition: 'all 0.2s', flexShrink: 0,
            }}>↑</button>
        </div>
      </div>
    </>
  )
}
