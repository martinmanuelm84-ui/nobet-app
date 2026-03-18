'use client';
import { useState, useEffect } from 'react';

const questions = [
  { q: "Cât de des ai jucat în ultima lună?", opts: ["Deloc sau o singură dată","De câteva ori","Săptămânal","Zilnic sau aproape zilnic"], scores:[0,1,2,3] },
  { q: "Jocul a afectat situația ta financiară?", opts: ["Nu semnificativ","Am cheltuit mai mult decât îmi permiteam","Am avut datorii sau am împrumutat bani","Situația financiară e gravă"], scores:[0,1,2,3] },
  { q: "Relațiile tale au fost afectate?", opts: ["Nu","Există tensiuni mici","Da, există conflicte sau distanțare","Relații importante sunt rupte sau în pericol"], scores:[0,1,2,3] },
  { q: "Cum te simți când vrei să te oprești?", opts: ["Bine, fără dificultate","Puțin neliniștit sau iritat","Anxios, cu gânduri persistente despre joc","Copleșit sau deprimat"], scores:[0,1,2,3] },
  { q: "Ai încercat vreodată să te oprești?", opts: ["Nu a fost necesar","Da, și am reușit","Am încercat dar nu am reușit","Am încercat de mai multe ori fără succes"], scores:[0,1,2,3] },
  { q: "Ai vorbit cu cineva despre asta?", opts: ["Nu am simțit nevoia","Am vorbit cu un prieten sau familie","Am consultat un specialist","Nu am vorbit cu nimeni"], scores:[0,0,0,1] },
];

const results = {
  low:  { badge:"Risc scăzut",  color:"#0f6e56", bg:"#e6f6f4", title:"Ești mai conștient decât crezi.", text:"Răspunsurile tale arată că jocul nu a preluat controlul. Faptul că ai făcut acest test e deja un semn de claritate." },
  mid:  { badge:"Risc moderat", color:"#854f0b", bg:"#faeeda", title:"Există semne care merită atenție.", text:"Unele aspecte ale vieții tale sunt afectate. E momentul potrivit să faci ceva — când lucrurile sunt încă gestionabile." },
  high: { badge:"Risc ridicat", color:"#a32d2d", bg:"#fcebeb", title:"Situația ta merită suport real.", text:"Răspunsurile tale arată o situație serioasă. Știm că e greu să recunoști asta — și tocmai de aceea ești aici." },
};

export default function Home() {
  const [cur, setCur] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => { if(c >= 127){ clearInterval(t); return 127; } return c+3; });
    }, 20);
    return () => clearInterval(t);
  }, []);

  function pick(score: number) {
    const newScores = [...scores, score];
    setScores(newScores);
    setTimeout(() => {
      if(cur + 1 >= questions.length) setDone(true);
      else setCur(cur + 1);
    }, 350);
  }

  function restart() { setCur(0); setScores([]); setDone(false); }

  const total = scores.reduce((a,b) => a+b, 0);
  const level = total <= 4 ? 'low' : total <= 9 ? 'mid' : 'high';
  const r = results[level];
  const pct = done ? 100 : Math.round((cur / questions.length) * 100);
  const q = questions[cur];

  return (
    <main style={{background:'#F4F1EB', minHeight:'100vh', fontFamily:'system-ui, sans-serif'}}>

      {/* NAV */}
      <nav style={{background:'#1B2B4B', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{color:'#fff', fontWeight:500, fontSize:18}}>
          [NUME<span style={{color:'#3DBDAD'}}>BET</span>]
        </div>
        <button style={{background:'#2A9D8F', color:'#fff', border:'none', padding:'8px 18px', borderRadius:20, cursor:'pointer', fontSize:14}}>
          Intră în cont
        </button>
      </nav>

      {/* HERO */}
      <section style={{background:'#1B2B4B', padding:'4rem 2rem', textAlign:'center'}}>
        <h1 style={{color:'#fff', fontSize:32, fontWeight:500, maxWidth:500, margin:'0 auto 1rem', lineHeight:1.3}}>
          Uneori e nevoie de <span style={{color:'#E9C46A'}}>un singur pas</span> diferit.
        </h1>
        <p style={{color:'rgba(255,255,255,0.6)', fontSize:16, maxWidth:380, margin:'0 auto 1.5rem', lineHeight:1.7}}>
          Un loc discret, fără judecată, pentru cei care vor să schimbe ceva.
        </p>
        <button
          onClick={() => document.getElementById('intake')?.scrollIntoView({behavior:'smooth'})}
          style={{background:'#2A9D8F', color:'#fff', border:'none', padding:'12px 28px', borderRadius:22, fontSize:15, cursor:'pointer', fontWeight:500}}>
          Începe cu un test scurt
        </button>
        <p style={{color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:'0.8rem'}}>Anonim · 2 minute · Fără înregistrare</p>
      </section>

      {/* COUNTER */}
      <div style={{display:'flex', justifyContent:'center', padding:'0 1.5rem'}}>
        <div style={{background:'#fff', borderRadius:16, padding:'2rem', textAlign:'center', marginTop:'-2rem', maxWidth:400, width:'100%', boxShadow:'0 4px 32px rgba(27,43,75,.10)'}}>
          <div style={{fontSize:11, color:'#5A6A8A', letterSpacing:1, textTransform:'uppercase', marginBottom:'0.4rem'}}>Zilele tale fără joc</div>
          <div style={{fontSize:52, fontWeight:500, color:'#2A9D8F', lineHeight:1}}>{count}</div>
          <div style={{fontSize:13, color:'#5A6A8A', marginTop:'0.3rem'}}>Fiecare zi contează.</div>
        </div>
      </div>

      {/* INTAKE */}
      <div id="intake" style={{maxWidth:540, margin:'2rem auto', padding:'0 1.5rem 3rem'}}>
        <div style={{background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 32px rgba(27,43,75,.10)'}}>
          <div style={{height:4, background:'#E8E3D9'}}>
            <div style={{height:4, background:'#2A9D8F', width:`${pct}%`, transition:'width .35s ease'}}/>
          </div>

          {!done ? (
            <div style={{padding:'2rem'}}>
              <div style={{fontSize:11, color:'#5A6A8A', letterSpacing:.6, textTransform:'uppercase', marginBottom:'0.5rem'}}>
                Întrebarea {cur+1} din {questions.length}
              </div>
              <div style={{fontSize:17, fontWeight:500, color:'#1B2B4B', marginBottom:'1.4rem', lineHeight:1.4}}>
                {q.q}
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                {q.opts.map((opt, i) => (
                  <button key={i} onClick={() => pick(q.scores[i])}
                    style={{padding:'13px 16px', border:'1.5px solid #E8E3D9', borderRadius:10, cursor:'pointer',
                      fontSize:14, color:'#1B2B4B', background:'#F4F1EB', textAlign:'left', fontFamily:'inherit',
                      display:'flex', alignItems:'center', gap:10}}>
                    <span style={{width:18, height:18, borderRadius:'50%', border:'1.5px solid #C4C4C4', flexShrink:0, background:'#fff', display:'inline-block'}}/>
                    {opt}
                  </button>
                ))}
              </div>
              {cur > 0 && (
                <button onClick={() => { setCur(cur-1); setScores(scores.slice(0,-1)); }}
                  style={{marginTop:'1.2rem', background:'none', border:'1px solid #E8E3D9', color:'#5A6A8A', padding:'8px 16px', borderRadius:18, cursor:'pointer', fontSize:13, fontFamily:'inherit'}}>
                  ← Înapoi
                </button>
              )}
            </div>
          ) : (
            <div style={{padding:'2rem', textAlign:'center'}}>
              <div style={{display:'inline-block', background:r.bg, color:r.color, padding:'6px 18px', borderRadius:20, fontSize:13, fontWeight:500, marginBottom:'1.2rem'}}>
                {r.badge}
              </div>
              <h2 style={{fontSize:19, fontWeight:500, color:'#1B2B4B', marginBottom:'0.8rem'}}>{r.title}</h2>
              <p style={{fontSize:14, color:'#5A6A8A', lineHeight:1.7, marginBottom:'1.5rem', maxWidth:380, margin:'0 auto 1.5rem'}}>{r.text}</p>
              <button style={{background:'#2A9D8F', color:'#fff', border:'none', padding:'12px 28px', borderRadius:22, fontSize:14, cursor:'pointer', fontFamily:'inherit', fontWeight:500}}>
                Vorbește cu AI Companion
              </button>
              <br/>
              <button onClick={restart} style={{marginTop:'0.8rem', background:'none', border:'none', color:'#5A6A8A', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}>
                Repetă testul
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#121E36', padding:'1.5rem 2rem', textAlign:'center'}}>
        <p style={{fontSize:11, color:'rgba(255,255,255,0.3)'}}>© 2025 [NUME PLATFORMĂ] · Discret · Anonim</p>
      </footer>
    </main>
  );
}