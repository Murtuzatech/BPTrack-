import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getReadings, avg } from '../lib/store'
export default function Compare() {
  const nav = useNavigate(); const [n, setN] = useState(30); const all = getReadings(); const now = Date.now()
  const win = (a, b) => all.filter(r => { const t = new Date(r.at).getTime(); return t >= now - a * 864e5 && t < now - b * 864e5 })
  const A = win(n, 0), B = win(2 * n, n)
  const m = (rs) => ({ sys: avg(rs.map(r => r.sys)), dia: avg(rs.map(r => r.dia)), pulse: avg(rs.map(r => r.pulse)) })
  const a = m(A), b = m(B); const data = [{ k: 'SYS', prev: b.sys, cur: a.sys }, { k: 'DIA', prev: b.dia, cur: a.dia }, { k: 'Pulse', prev: b.pulse, cur: a.pulse }]
  const pill = (x) => ({ border: 0, cursor: 'pointer', flex: 1, padding: 8, background: x ? '#1f6feb' : '#e3eeff', color: x ? '#fff' : '#1f6feb' })
  return <div className="page"><div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 12 }}>
    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => nav(-1)} /><h1>Report Comparison</h1></div>
    <div className="row" style={{ gap: 6, marginBottom: 12 }}>{[[7, '7 Days'], [30, '30 Days'], [90, '3 Months']].map(([d, l]) =>
      <button key={d} className="badge" style={pill(n === d)} onClick={() => setN(d)}>{l}</button>)}</div>
    <div className="card"><div className="row muted"><span>Metric</span><span>Previous</span><span>Current</span><span>Change</span></div>
      {data.map(d => { const diff = B.length ? d.cur - d.prev : null
        return <div key={d.k} className="row" style={{ padding: '8px 0' }}><b>{d.k}</b><span>{B.length ? d.prev : '—'}</span><span>{d.cur}</span>
          <span style={{ color: diff > 0 ? '#e5484d' : '#22a06b' }}>{diff === null ? '—' : (diff > 0 ? '+' : '') + diff}</span></div> })}
      <p className="muted">Previous: {B.length} readings • Current: {A.length} readings</p></div>
    <div className="card" style={{ height: 250 }}><ResponsiveContainer><BarChart data={data}><XAxis dataKey="k" /><YAxis /><Tooltip /><Legend />
      <Bar dataKey="prev" name="Previous" fill="#9bbcf5" /><Bar dataKey="cur" name="Current" fill="#1f6feb" /></BarChart></ResponsiveContainer></div></div>
}
