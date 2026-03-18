'use client';
import { useState, useRef, useEffect } from 'react';

export default function Companion() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bună. Sunt un AI — dar unul care știe cum e, pentru că am fost construit pe experiența cuiva care a trecut prin asta. Poți să-mi spui orice, fără să te gândești cum sună.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'A apărut o eroare. Încearcă din nou.' }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F1EB' }}>
      <div style={{ background: '#1B2B4B', padding: '1rem 1.3rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>C</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>Companion</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Am trecut prin asta. Acum am antrenat un AI cu tot ce știu.</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? '#1B2B4B' : '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, flexShrink: 0 }}>
              {m.role === 'user' ? 'Tu' : 'AI'}
            </div>
            <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? '#1B2B4B' : '#fff', color: m.role === 'user' ? '#fff' : '#1B2B4B', fontSize: 14, lineHeight: 1.6 }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>AI</div>
            <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: '#fff', fontSize: 14, color: '#5A6A8A' }}>...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '0.8rem', borderTop: '1px solid #E8E3D9', display: 'flex', gap: 8, background: '#fff' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Scrie ceva..."
          style={{ flex: 1, border: '1.5px solid #E8E3D9', borderRadius: 12, padding: '9px 12px', fontSize: 14, outline: 'none', background: '#F4F1EB' }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A9D8F', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18 }}>↑</button>
      </div>
    </div>
  );
}
