import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
import { getReadings, inRange, avg, classify } from '../lib/store'
import { chat, SYSTEM, hasGemini } from '../lib/gemini'
const TIPS = ['Reduce salt intake', 'Stay hydrated', 'Stay active: 30 min walk daily', 'Manage stress and sleep well']
export default function Insights() {
  const nav = useNavigate(); const all = getReadings(); const last = all[all.length - 1]; const c = classify(last.sys, last.dia)
  const cur = avg(inRange(all, 7).map(r => r.sys)); const prev = avg(inRange(all, 14).filter(r => !inRange(all, 7).includes(r)).map(r => r.sys))
  const diff = prev ? cur - prev : 0
  const [ai, setAi] = useState(''); const [busy, setBusy] = useState(false)
  const gen = async () => {
    setBusy(true)
    try { const rs = all.slice(-14).map(r => `${r.sys}/${r.dia}/${r.pulse}`).join(', ')
      setAi(await chat([{ role: 'user', parts: [{ text: 'Analyse my recent readings. Give a 4-line summary and 3 tips.' }] }], SYSTEM(rs)))
    } catch (e) { setAi(e.message) } finally { setBusy(false) } }
  return <div className="page"><h1 style={{ marginBottom: 14 }}>AI Insights</h1>
    <div className="card"><p className="muted">Today's Reading</p><b style={{ fontSize: 26 }}>{last.sys} / {last.dia}</b> <span className="muted">Pulse {last.pulse}</span>
      <p style={{ color: c.color, marginTop: 6 }}>Your reading is {c.label.toLowerCase()}.</p></div>
    <div className="card"><b>Trend (7 days)</b><p style={{ marginTop: 6 }}>
      {diff > 0 ? <TrendingUp size={16} color="#e5484d" /> : <TrendingDown size={16} color="#22a06b" />} Average systolic {cur}
      {prev ? ` (${diff >= 0 ? '+' : ''}${diff} vs last week)` : ''}. Keep monitoring.</p></div>
    <div className="card"><b>Health Tips</b>{TIPS.map(t => <p key={t} className="muted" style={{ marginTop: 6 }}>• {t}</p>)}</div>
    {ai && <div className="card" style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{ai}</div>}
    {hasGemini && <button className="btn ghost" disabled={busy} onClick={gen}><Sparkles size={15} /> {busy ? 'Analysing…' : 'Generate AI Insight'}</button>}
    <button className="btn" onClick={() => nav('/ai')}>Ask AI a Question</button></div>
}
