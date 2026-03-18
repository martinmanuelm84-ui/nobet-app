'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { Lang, t } from '@/lib/i18n'

type Entry = { id: string; date: string; text: string; mood: number }

export default function JournalPage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [entries, setEntries] = useState<Entry[]>([])
  const [text, setText] = useState('')
  const [mood, setMood] = useState(2)
  const [saved, setSaved] = useState(false)
  const tr = t[lang].journal

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
    const raw = localStorage.getItem('nobet_journal')
    if (raw) setEntries(JSON.parse(raw))
  }, [])

  function save() {
    if (!text.trim()) return
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text: text.trim(),
      mood,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('nobet_journal', JSON.stringify(updated))
    setText('')
    setMood(2)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function deleteEntry(id: string) {
    if (!confirm(tr.deleteConfirm)) return
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('nobet_journal', JSON.stringify(updated))
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <>
      <div className="page">
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 className="page-title">{tr.title}</h1>
            <p className="page-subtitle">{tr.subtitle}</p>
          </div>
          <div className="lang-switch" style={{ flexShrink: 0, marginTop: '0.25rem' }}>
            <button className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')}>RO</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>

        {/* Write area */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          {/* Mood */}
          <div style={{ marginBottom: '0.875rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              {tr.mood}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {tr.moods.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  style={{
                    width: 40, height: 40, borderRadius: '10px',
                    border: `2px solid ${mood === i ? 'var(--accent)' : 'transparent'}`,
                    background: mood === i ? 'var(--accent-light)' : 'var(--surface2)',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{emoji}</button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={tr.placeholder}
            rows={4}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '0.875rem',
              fontSize: '0.92rem',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--text)',
              background: 'var(--bg)',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.6,
              marginBottom: '0.875rem',
            }}
          />
          <button
            className="btn-primary"
            onClick={save}
            style={{ background: saved ? '#4caf50' : undefined }}
          >
            {saved ? tr.saved : tr.save}
          </button>
        </div>

        {/* Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)', fontSize: '0.88rem' }}>
              {tr.noEntries}
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{tr.moods[entry.mood]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{formatDate(entry.date)}</span>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '0.8rem', padding: '0.25rem' }}
                  >✕</button>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <Nav lang={lang} onLangChange={setLang} />
    </>
  )
}
