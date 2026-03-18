'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

type Message = { role: 'user' | 'assistant'; content: string }

const SYSTEM = `Ești un companion cald și empatic pentru cineva care se recuperează din dependența de jocuri de noroc. Ai fost creat pe baza experienței reale a cuiva care a trecut prin asta și s-a recuperat. Vorbești simplu, direct, fără judecată. Nu ești terapeut — ești un prieten care înțelege. Răspunzi scurt (2-4 propoziții), cald, și întotdeauna în aceeași limbă în care ți se vorbește. Nu dai sfaturi nesolicitate. Nu moralizezi. Ești prezent, nu predicativ.`

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
      <div style={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - var(--nav-h))`, maxWidth: 480, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>💚</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{tr.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{tr.subtitle}</div>
              </div>
            </div>
          </div>
          <div className="lang-switch">
            <button className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')}>RO</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', marginRight: '0.5rem', flexShrink: 0, alignSelf: 'flex-end',
                }}>💚</div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '0.75rem 1rem',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                fontSize: '0.92rem',
                lineHeight: 1.55,
              }}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', marginLeft: '0.5rem', flexShrink: 0, alignSelf: 'flex-end',
                }}>Tu</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem',
              }}>💚</div>
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px',
                fontSize: '0.88rem',
                color: 'var(--text3)',
              }}>{tr.thinking}</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '0.875rem 1.25rem',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '0.625rem',
          flexShrink: 0,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={tr.placeholder}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '0.92rem',
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44,
              borderRadius: '12px',
              background: input.trim() ? 'var(--accent)' : 'var(--surface2)',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
              fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >↑</button>
        </div>
      </div>

      <Nav lang={lang} onLangChange={setLang} />
    </>
  )
}
