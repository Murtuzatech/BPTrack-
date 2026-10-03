import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { addReading } from '../lib/store'
export default function ScanResult() {
  const { state } = useLocation(); const nav = useNavigate()
  const [v, setV] = useState(state?.values || {})
  if (!state) return <Navigate to="/scan" replace />
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const ok = +v.sys > 0 && +v.dia > 0 && +v.pulse > 0
  const save = () => { addReading({ sys: +v.sys, dia: +v.dia, pulse: +v.pulse, scanned: true }); nav('/history') }
  return <div className="page"><h1 style={{ marginBottom: 14 }}>Scan Result</h1>
    {state.img && <img src={state.img} alt="scan" style={{ width: '100%', borderRadius: 14, marginBottom: 14 }} />}
    <div className="card"><b>Detected Values</b><p className="muted" style={{ margin: '4px 0 10px' }}>Confidence: {v.confidence || '—'} • please verify</p>
      {[['sys', 'SYS (mmHg)'], ['dia', 'DIA (mmHg)'], ['pulse', 'PULSE (BPM)']].map(([k, l]) =>
        <div key={k} className="row" style={{ marginBottom: 8 }}><span className="muted">{l}</span>
          <input className="input" style={{ width: 110, marginBottom: 0, textAlign: 'right' }} type="number" value={v[k] ?? ''} onChange={set(k)} /></div>)}</div>
    <div className="row" style={{ gap: 8 }}>
      <button className="btn ghost" onClick={() => nav('/scan')}>Retake</button>
      <button className="btn" disabled={!ok} style={{ opacity: ok ? 1 : .5 }} onClick={save}>Confirm & Save</button></div></div>
}
