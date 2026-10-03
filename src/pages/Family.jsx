import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCircle, Trash2 } from 'lucide-react'
import { classify } from '../lib/store'
import { pushFamily } from '../lib/sync'
const load = () => JSON.parse(localStorage.getItem('bp_family') || '[]')
export default function Family() {
  const nav = useNavigate(); const [list, setList] = useState(load()); const [open, setOpen] = useState(false)
  const [f, setF] = useState({ name: '', relation: 'Father', sys: '', dia: '', pulse: '' })
  const commit = (n) => { localStorage.setItem('bp_family', JSON.stringify(n)); setList(n); pushFamily(n).catch(() => {}) }
  const add = () => { if (!f.name.trim()) return; commit([...list, { ...f, id: crypto.randomUUID(), sys: +f.sys || null, dia: +f.dia || null, pulse: +f.pulse || null }]); setOpen(false); setF({ name: '', relation: 'Father', sys: '', dia: '', pulse: '' }) }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return <div className="page"><div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 14 }}>
    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => nav(-1)} /><h1>My Family</h1></div>
    {!list.length && <p className="muted center" style={{ margin: 20 }}>No family members added yet.</p>}
    {list.map(m => { const c = m.sys && m.dia ? classify(m.sys, m.dia) : null
      return <div key={m.id} className="card row"><span className="row" style={{ gap: 10 }}><UserCircle size={38} color="#1f6feb" />
        <span><b>{m.name}</b> <span className="muted">({m.relation})</span><br />
          <span className="muted">Last BP: {m.sys ? `${m.sys}/${m.dia}` : '—'}</span> {c && <span className="badge" style={{ color: c.color, background: c.bg }}>{c.label}</span>}</span></span>
        <Trash2 size={16} color="#7a869a" style={{ cursor: 'pointer' }} onClick={() => commit(list.filter(x => x.id !== m.id))} /></div> })}
    {open ? <div className="card"><input className="input" placeholder="Name" value={f.name} onChange={set('name')} />
      <select className="input" value={f.relation} onChange={set('relation')}>{['Father', 'Mother', 'Spouse', 'Child', 'Sibling', 'Other'].map(r => <option key={r}>{r}</option>)}</select>
      <div className="row" style={{ gap: 6 }}>{[['sys', 'SYS'], ['dia', 'DIA'], ['pulse', 'Pulse']].map(([k, l]) => <input key={k} className="input" type="number" placeholder={l} value={f[k]} onChange={set(k)} />)}</div>
      <button className="btn" onClick={add}>Save Member</button></div>
      : <button className="btn" onClick={() => setOpen(true)}>Add Family Member</button>}</div>
}
