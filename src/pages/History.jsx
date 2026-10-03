import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, BarChart3, Plus } from 'lucide-react'
import { getReadings, deleteReading, inRange, classify, dayKey } from '../lib/store'
const FILTERS = [['Today', 1], ['7 Days', 7], ['30 Days', 30], ['3 Months', 90]]
export default function History() {
  const nav = useNavigate(); const [days, setDays] = useState(30); const [all, setAll] = useState(getReadings())
  const list = inRange(all, days).sort((a, b) => new Date(b.at) - new Date(a.at))
  const groups = list.reduce((m, r) => ((m[dayKey(r.at)] ||= []).push(r), m), {})
  return <div className="page">
    <div className="row" style={{ marginBottom: 12 }}><h1>History</h1>
      <span style={{ display: 'flex', gap: 8 }}>
        <BarChart3 color="#1f6feb" style={{ cursor: 'pointer' }} onClick={() => nav('/analytics')} />
        <Plus color="#1f6feb" style={{ cursor: 'pointer' }} onClick={() => nav('/add')} /></span></div>
    <div className="row" style={{ gap: 6, marginBottom: 14 }}>{FILTERS.map(([l, d]) =>
      <button key={l} className="badge" onClick={() => setDays(d)} style={{ border: 0, cursor: 'pointer', flex: 1, padding: 8,
        background: days === d ? '#1f6feb' : '#e3eeff', color: days === d ? '#fff' : '#1f6feb' }}>{l}</button>)}</div>
    {!list.length && <p className="muted center">No readings in this period.</p>}
    {Object.entries(groups).map(([day, rs]) => <div key={day}>
      <p className="muted" style={{ margin: '8px 0' }}>{new Date(day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      {rs.map(r => { const c = classify(r.sys, r.dia); return <div key={r.id} className="card row" style={{ marginBottom: 8 }}>
        <div><b style={{ fontSize: 18 }}>{r.sys} / {r.dia}</b> <span className="muted">Pulse {r.pulse}</span>
          <div className="muted">{new Date(r.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            {r.symptom && r.symptom !== 'None' ? ` • ${r.symptom}` : ''}</div></div>
        <div style={{ textAlign: 'right' }}><span className="badge" style={{ color: c.color, background: c.bg }}>{c.label}</span><br />
          <Trash2 size={16} color="#7a869a" style={{ cursor: 'pointer', marginTop: 6 }} onClick={() => setAll(deleteReading(r.id))} /></div></div> })}
    </div>)}</div>
}
