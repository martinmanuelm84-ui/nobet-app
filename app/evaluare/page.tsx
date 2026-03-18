'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import { Lang } from '@/lib/i18n'

type Answer = number | null

const questions = {
  ro: [
    {
      id: 1,
      text: 'Cât de des joci sau ai jucat în ultima lună?',
      options: [
        'Rar — o dată sau de două ori',
        'Câteva ori pe săptămână',
        'Aproape zilnic',
        'Zilnic, uneori de mai multe ori pe zi',
      ],
    },
    {
      id: 2,
      text: 'Ai încercat vreodată să te oprești sau să reduci și nu ai reușit?',
      options: [
        'Nu, nu am încercat',
        'Am încercat o dată și a mers',
        'Am încercat de câteva ori, cu succes parțial',
        'Am încercat de multe ori și nu am reușit',
      ],
    },
    {
      id: 3,
      text: 'Jocul a afectat relațiile sau finanțele tale?',
      options: [
        'Nu, totul e ok',
        'Puțin — am cheltuit mai mult decât trebuia',
        'Da — am tensiuni în relații sau probleme financiare',
        'Serios — am pierdut bani importanți sau relații din cauza asta',
      ],
    },
    {
      id: 4,
      text: 'Cum te simți când nu joci?',
      options: [
        'Normal, nu mă gândesc la asta',
        'Uneori mă gândesc, dar pot trece ușor',
        'Iritabil sau neliniștit',
        'Anxios, nu mă pot concentra pe altceva',
      ],
    },
    {
      id: 5,
      text: 'De ce ești aici azi?',
      options: [
        'Sunt curios, nu e neapărat o problemă',
        'Vreau să reduc, nu să mă opresc complet',
        'Vreau să mă opresc, dar nu știu de unde să încep',
        'Am ajuns la un punct de unde nu mai pot continua așa',
      ],
    },
  ],
  en: [
    {
      id: 1,
      text: 'How often have you gambled in the past month?',
      options: [
        'Rarely — once or twice',
        'A few times a week',
        'Almost daily',
        'Daily, sometimes multiple times a day',
      ],
    },
    {
      id: 2,
      text: 'Have you ever tried to stop or cut back and failed?',
      options: [
        "No, I haven't tried",
        'I tried once and it worked',
        'I tried a few times, with partial success',
        "I've tried many times and couldn't stop",
      ],
    },
    {
      id: 3,
      text: 'Has gambling affected your relationships or finances?',
      options: [
        "No, everything's fine",
        'A little — I spent more than I should have',
        'Yes — I have relationship tension or financial problems',
        "Seriously — I've lost significant money or relationships",
      ],
    },
    {
      id: 4,
      text: 'How do you feel when you\'re not gambling?',
      options: [
        "Normal, I don't think about it",
        'I think about it sometimes but can move on easily',
        'Irritable or restless',
        "Anxious, can't focus on anything else",
      ],
    },
    {
      id: 5,
      text: 'Why are you here today?',
      options: [
        "I'm curious, it's not necessarily a problem",
        'I want to cut back, not stop completely',
        "I want to stop but don't know where to start",
        "I've reached a point where I can't continue like this",
      ],
    },
  ],
}

function getResult(answers: Answer[], lang: Lang) {
  const score = answers.reduce((sum: number, a) => sum + (a ?? 0), 0)

  if (lang === 'ro') {
    if (score <= 4) return {
      level: 'scăzut',
      message: 'Răspunsurile tale arată că jocul nu e încă o problemă majoră în viața ta. Ești aici din precauție sau curiozitate — și asta e un semn bun. Cel mai bun moment să pui limite e înainte să fie nevoie urgentă.',
      sub: 'Nu ești în pericol imediat, dar să ai un instrument la îndemână nu strică niciodată.',
      cta: 'Vorbește cu Antrenorul',
    }
    if (score <= 9) return {
      level: 'moderat',
      message: 'Există un tipar care merită atenție. Nu ești într-o situație fără ieșire — departe de asta. Dar dacă simți că jocul ocupă mai mult spațiu decât vrei, acum e momentul potrivit să faci ceva.',
      sub: 'Mulți oameni au trecut prin exact ce descrii tu și au reușit să schimbe lucrurile. E mult mai puțin dramatic decât pare.',
      cta: 'Vorbește cu Antrenorul',
    }
    return {
      level: 'ridicat',
      message: 'Îți trebuie curaj să recunoști că lucrurile au scăpat de sub control. Ai ajuns la un punct dificil — și faptul că ești aici înseamnă că o parte din tine vrea să schimbe asta.',
      sub: 'Nu ești primul și nu vei fi ultimul care trece prin asta. Se poate ieși. Nu dintr-odată, nu fără efort — dar se poate.',
      cta: 'Vorbește cu Antrenorul',
    }
  } else {
    if (score <= 4) return {
      level: 'low',
      message: "Your answers suggest gambling isn't yet a major problem in your life. You're here out of caution or curiosity — and that's a good sign. The best time to set limits is before you urgently need to.",
      sub: "You're not in immediate danger, but having a tool at hand never hurts.",
      cta: 'Talk to the Coach',
    }
    if (score <= 9) return {
      level: 'moderate',
      message: "There's a pattern worth paying attention to. You're not in a hopeless situation — far from it. But if gambling is taking up more space than you want, now is the right time to do something about it.",
      sub: 'Many people have been through exactly what you describe and managed to change things. It\'s much less dramatic than it seems.',
      cta: 'Talk to the Coach',
    }
    return {
      level: 'high',
      message: "It takes courage to admit things have gotten out of control. You've reached a difficult point — and the fact that you're here means part of you wants to change that.",
      sub: "You're not the first and won't be the last to go through this. There is a way out. Not all at once, not without effort — but it's possible.",
      cta: 'Talk to the Coach',
    }
  }
}

export default function EvaluarePage() {
  const [lang, setLang] = useState<Lang>('ro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([null, null, null, null, null])
  const [done, setDone] = useState(false)
  const router = useRouter()
  const qs = questions[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('nobet_lang') as Lang
    if (savedLang) setLang(savedLang)
  }, [])

  function selectAnswer(idx: number) {
    const newAnswers = [...answers]
    newAnswers[current] = idx
    setAnswers(newAnswers)
    setTimeout(() => {
      if (current < qs.length - 1) {
        setCurrent(current + 1)
      } else {
        setDone(true)
      }
    }, 300)
  }

  const result = done ? getResult(answers, lang) : null

  return (
    <>
      <Nav lang={lang} onLangChange={setLang} />
      <div className="page" style={{ maxWidth: 560 }}>
        {!done ? (
          <>
            {/* Progress */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.72rem', color: 'var(--text3)',
                letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: '0.625rem',
              }}>
                <span>{lang === 'ro' ? 'Evaluare' : 'Assessment'}</span>
                <span>{current + 1} / {qs.length}</span>
              </div>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 3 }}>
                <div style={{
                  height: '100%',
                  width: `${((current + 1) / qs.length) * 100}%`,
                  background: 'var(--accent)',
                  borderRadius: 3,
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>

            {/* Question */}
            <h2 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: '1.4rem', fontWeight: 400,
              color: 'var(--text)', lineHeight: 1.35,
              marginBottom: '1.75rem',
            }}>
              {qs[current].text}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {qs[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: answers[current] === i ? 'var(--accent)' : 'var(--surface)',
                    border: `1px solid ${answers[current] === i ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    color: answers[current] === i ? '#fff' : 'var(--text2)',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                    transition: 'all 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                  }}
                  onMouseOver={e => {
                    if (answers[current] !== i) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                    }
                  }}
                  onMouseOut={e => {
                    if (answers[current] !== i) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text2)'
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Result */
          <div style={{ paddingTop: '1rem' }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text3)', marginBottom: '1.5rem',
            }}>
              {lang === 'ro' ? 'Rezultatul evaluării' : 'Assessment result'}
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.75rem',
              marginBottom: '1.25rem',
            }}>
              <p style={{
                fontSize: '1.05rem', color: 'var(--text)',
                lineHeight: 1.75, marginBottom: '1rem',
              }}>
                {result!.message}
              </p>
              <p style={{
                fontSize: '0.9rem', color: 'var(--text2)',
                lineHeight: 1.7, fontStyle: 'italic',
              }}>
                {result!.sub}
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => router.push('/companion')}
              style={{ marginBottom: '0.75rem' }}
            >
              {result!.cta} →
            </button>

            <button
              className="btn-secondary"
              onClick={() => router.push('/contor')}
            >
              {lang === 'ro' ? 'Mergi direct la contor' : 'Go directly to counter'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
