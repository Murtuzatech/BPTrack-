import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addReading, classify } from '../lib/store'
const SYMPTOMS = ['None', 'Headache', 'Dizziness', 'Chest pain', 'Fatigue', 'Blurred vision']
const local = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16)
export default function AddReading() {
  const nav = useNavigate()
  const [f, setF] = useState({ sys: '', dia: '', pulse: '', at: local(), symptom: 'None', notes: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = () => {
    const sys = +f.sys, dia = +f.dia, pulse = +f.pulse
    if (!(sys >= 60 && sys <= 260) || !(dia >= 40 && dia <= 160) || !(pulse >= 30 && pulse <= 220))
      return setErr('Please enter valid Systolic, Diastolic and Pulse values.')
    addReading({ sys, dia, pulse, at: new Date(f.at).toISOString(), symptom: f.symptom, notes: f.notes })
    nav('/history')
  }
  const c = f.sys && f.dia ? classify(+f.sys, +f.dia) : null
  return <div className="page"><h1 style={{ marginBottom: 14 }}>Add BP Reading</h1>
    <div className="row" style={{ gap: 8, marginBottom: 14 }}>
      <button className="btn">Manual Entry</button>
      <button className="btn" style={{ background: '#e3eeff', color: '#1f6feb' }} onClick={() => nav('/scan')}>Scan BP</button></div>
    <label className="muted">Systolic (mmHg)</label><input className="input" type="number" value={f.sys} onChange={set('sys')} />
    <label className="muted">Diastolic (mmHg)</label><input className="input" type="number" value={f.dia} onChange={set('dia')} />
    <label className="muted">Pulse (BPM)</label><input className="input" type="number" value={f.pulse} onChange={set('pulse')} />
    <label className="muted">Date & Time</label><input className="input" type="datetime-local" value={f.at} onChange={set('at')} />
    <label className="muted">Symptoms (optional)</label>
    <select className="input" value={f.symptom} onChange={set('symptom')}>{SYMPTOMS.map(s => <option key={s}>{s}</option>)}</select>
    <label className="muted">Notes (optional)</label><input className="input" placeholder="Add notes" value={f.notes} onChange={set('notes')} />
    {c && <p style={{ margin: '0 0 10px' }}>Status: <span className="badge" style={{ color: c.color, background: c.bg }}>{c.label}</span></p>}
    {err && <p style={{ color: '#e5484d', marginBottom: 10 }}>{err}</p>}
    <button className="btn" onClick={save}>Save</button></div>
}
