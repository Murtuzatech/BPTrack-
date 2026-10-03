import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getReadings, inRange, avg } from '../lib/store'
const RANGES = [['7 Days', 7], ['30 Days', 30], ['3 Months', 90]]
const METRICS = [['Systolic', 'sys'], ['Diastolic', 'dia'], ['Pulse', 'pulse']]
export default function Analytics() {
  const nav = useNavigate(); const [days, setDays] = useState(7); const [m, setM] = useState('sys')
  const list = inRange(getReadings(), days).sort((a, b) => new Date(a.at) - new Date(b.at))
  const data = list.map(r => ({ d: new Date(r.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), sys: r.sys, dia: r.dia, pulse: r.pulse }))
  const tab = (active) => ({ border: 0, cursor: 'pointer', flex: 1, padding: 8, background: active ? '#1f6feb' : '#e3eeff', color: active ? '#fff' : '#1f6feb' })
  return <div className="page">
    <div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 12 }}>
      <ArrowLeft onClick={() => nav(-1)} style={{ cursor: 'pointer' }} /><h1>Analytics</h1></div>
    <div className="row" style={{ gap: 6, marginBottom: 12 }}>{RANGES.map(([l, d]) =>
      <button key={l} className="badge" style={tab(days === d)} onClick={() => setDays(d)}>{l}</button>)}</div>
    <div className="card center"><p className="muted">Average</p>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{avg(list.map(r => r.sys))} / {avg(list.map(r => r.dia))}</div>
      <p className="muted">Pulse {avg(list.map(r => r.pulse))} BPM • {list.length} readings</p></div>
    <div className="row" style={{ gap: 6, marginBottom: 12 }}>{METRICS.map(([l, k]) =>
      <button key={k} className="badge" style={tab(m === k)} onClick={() => setM(k)}>{l}</button>)}</div>
    <div className="card" style={{ height: 280 }}><ResponsiveContainer>
      <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#e6ebf3" /><XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} domain={['auto', 'auto']} />
        <Tooltip /><Legend />
        {m === 'pulse' ? <Line dataKey="pulse" name="Pulse" stroke="#f59e0b" strokeWidth={2} /> : <>
          <Line dataKey="sys" name="Systolic" stroke="#1f6feb" strokeWidth={2} opacity={m === 'sys' ? 1 : .35} />
          <Line dataKey="dia" name="Diastolic" stroke="#22a06b" strokeWidth={2} opacity={m === 'dia' ? 1 : .35} /></>}
      </LineChart></ResponsiveContainer></div></div>
}
