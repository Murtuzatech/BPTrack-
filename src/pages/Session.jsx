import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addReading, avg, classify } from '../lib/store'
const empty = { sys: '', dia: '', pulse: '' }
export default function Session() {
  const nav = useNavigate(); const [r, setR] = useState([empty, empty]); const [wait, setWait] = useState(0)
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait(wait - 1), 1000); return () => clearTimeout(t) }, [wait])
  const set = (i, k) => (e) => setR(r.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x))
  const valid = (x) => +x.sys > 0 && +x.dia > 0 && +x.pulse > 0
  const ready = r.every(valid)
  const a = ready ? { sys: avg(r.map(x => +x.sys)), dia: avg(r.map(x => +x.dia)), pulse: avg(r.map(x => +x.pulse)) } : null
  const save = () => { r.forEach(x => addReading({ sys: +x.sys, dia: +x.dia, pulse: +x.pulse, session: true })); nav('/monitor') }
  return <div className="page"><h1>BP Session</h1><p className="muted" style={{ marginBottom: 14 }}>Take 2 readings, 1 minute apart</p>
    {r.map((x, i) => <div key={i} className="card"><b>Reading {i + 1}</b>
      <div className="row" style={{ gap: 8, marginTop: 8 }}>{[['sys', 'SYS'], ['dia', 'DIA'], ['pulse', 'Pulse']].map(([k, l]) =>
        <input key={k} className="input" style={{ marginBottom: 0 }} type="number" placeholder={l} value={x[k]} onChange={set(i, k)} />)}</div>
      {i === 0 && <button className="btn ghost" disabled={wait > 0} onClick={() => setWait(60)}>
        {wait > 0 ? `Wait ${wait}s for next reading` : 'Start 1-min timer'}</button>}</div>)}
    {a && <div className="card center"><p className="muted">Session Average</p>
      <div style={{ fontSize: 28, fontWeight: 700, color: classify(a.sys, a.dia).color }}>{a.sys} / {a.dia}</div>
      <p className="muted">Pulse {a.pulse} • {classify(a.sys, a.dia).label}</p></div>}
    <button className="btn" disabled={!ready} style={{ opacity: ready ? 1 : .5 }} onClick={save}>Save Session</button></div>
}
