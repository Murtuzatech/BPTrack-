import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Sun, Moon } from 'lucide-react'
import { getPlan, savePlan, getReadings, dayKey } from '../lib/store'
export default function Monitor() {
  const nav = useNavigate(); const [plan, setPlan] = useState(getPlan()); const readings = getReadings()
  const done = new Set(readings.map(r => dayKey(r.at)))
  const days = Array.from({ length: 30 }, (_, i) => dayKey(new Date(plan.start).getTime() + i * 864e5))
  const today = dayKey(Date.now()); const completed = days.filter(d => done.has(d)).length
  const upd = (k) => (e) => setPlan(savePlan({ ...plan, [k]: e.target.value }))
  return <div className="page"><h1 style={{ marginBottom: 14 }}>30-Day Plan</h1>
    <div className="card"><label className="muted">Start Date</label>
      <input className="input" type="date" value={plan.start} onChange={upd('start')} />
      <div className="row"><span><Sun size={15} /> Morning</span><input type="time" value={plan.morning} onChange={upd('morning')} /></div>
      <div className="row" style={{ marginTop: 10 }}><span><Moon size={15} /> Evening</span><input type="time" value={plan.evening} onChange={upd('evening')} /></div></div>
    <div className="card"><div className="row"><b>Progress</b><span className="muted">{completed} / 30 days</span></div>
      <div className="bar" style={{ margin: '10px 0 14px' }}><b style={{ width: `${completed / 30 * 100}%` }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>{days.map((d, i) => {
        const ok = done.has(d), miss = !ok && d < today
        return <div key={d} className="center" style={{ fontSize: 11 }}><span className="muted">Day {i + 1}</span>
          <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff',
            background: ok ? '#22a06b' : miss ? '#e5484d' : '#e6ebf3', outline: d === today ? '2px solid #1f6feb' : 'none' }}>{ok && <Check size={14} />}</span></div> })}
      </div></div>
    <button className="btn" onClick={() => nav('/session')}>Start BP Session</button></div>
}
