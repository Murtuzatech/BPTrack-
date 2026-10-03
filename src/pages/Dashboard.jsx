import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getReadings, classify } from '../lib/store'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Good Night'
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  if (h < 21) return 'Good Evening'
  return 'Good Night'
}

export default function Dashboard() {
  const { user } = useAuth(); const nav = useNavigate()
  const all = getReadings(); const last = all[all.length - 1]; const c = classify(last.sys, last.dia)
  const trend = all.slice(-7).map(r => ({ v: r.sys })); const done = Math.min(all.length, 30)
  return <div className="page">
    <p className="muted">{greeting()},</p><h1 style={{ marginBottom: 16 }}>{user.name}</h1>
    <div className="card"><p className="muted">Today's BP</p>
      <div style={{ fontSize: 34, fontWeight: 700 }}>{last.sys} / {last.dia} <span className="muted">mmHg</span></div>
      <div className="row" style={{ marginTop: 6 }}><span className="muted">Pulse {last.pulse} BPM</span>
        <span className="badge" style={{ color: c.color, background: c.bg }}>{c.label}</span></div></div>
    <div className="card"><div className="row"><b>30-Day Monitoring</b><span className="muted">{done} / 30 days</span></div>
      <div className="bar" style={{ marginTop: 10 }}><b style={{ width: `${done / 30 * 100}%` }} /></div></div>
    <div className="card"><b>7-Day Trend</b><div style={{ height: 90 }}><ResponsiveContainer>
      <LineChart data={trend}><Line dataKey="v" stroke="#1f6feb" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></div>
    <div className="row" style={{ gap: 8, marginBottom: 14 }}>{[['Scan BP', '/scan'], ['AI Insights', '/insights'], ['Learn', '/learn']].map(([l, p]) =>
      <button key={p} className="btn" style={{ background: '#e3eeff', color: '#1f6feb', padding: 10, fontSize: 13 }} onClick={() => nav(p)}>{l}</button>)}</div>
    <button className="btn" onClick={() => nav('/add')}><Plus size={16} /> Add Reading</button></div>
}