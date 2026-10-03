import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Toggle from '../components/Toggle'
import { getSettings, saveSettings } from '../lib/settings'
import { syncAll } from '../lib/sync'
import { getReadings } from '../lib/store'
export default function Settings() {
  const nav = useNavigate(); const { user, updateUser } = useAuth(); const [s, setS] = useState(getSettings())
  const [p, setP] = useState({ name: user.name, age: user.age, gender: user.gender, height: user.height, weight: user.weight, emergency: user.emergency, doctor: user.doctor })
  const [msg, setMsg] = useState('')
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 2500) }
  const upd = (x) => setS(saveSettings(x))
  const notif = async (on) => { if (on && typeof Notification !== 'undefined' && (await Notification.requestPermission()) !== 'granted') return flash('Notification permission denied'); upd({ notifications: on }) }
  const exportData = () => { const blob = new Blob([JSON.stringify({ user, readings: getReadings() }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bptrack-data.json'; a.click() }
  const clearDemo = () => { localStorage.setItem('bp_readings', JSON.stringify(getReadings().filter(r => !r.demo))); flash('Sample data removed') }
  const sync = async () => { try { await syncAll(); flash('Synced ✓') } catch (e) { flash('Sync failed: ' + e.message) } }
  const f = (k, l) => <div key={k}><label className="muted">{l}</label><input className="input" value={p[k] ?? ''} onChange={e => setP({ ...p, [k]: e.target.value })} /></div>
  const link = (l, to) => <div key={to} className="card row" style={{ cursor: 'pointer' }} onClick={() => nav(to)}>{l}<ChevronRight size={16} /></div>
  return <div className="page"><h1 style={{ marginBottom: 14 }}>Settings</h1>
    <div className="card"><b>Profile</b><div style={{ marginTop: 10 }}>
      {f('name', 'Name')}{f('age', 'Age')}{f('gender', 'Gender')}{f('height', 'Height')}{f('weight', 'Weight')}{f('emergency', 'Emergency contact')}{f('doctor', 'Doctor information')}</div>
      <button className="btn" onClick={() => { updateUser(p); flash('Profile saved ✓') }}>Save Profile</button></div>
    <div className="card row">Dark mode<Toggle on={s.dark} onChange={v => upd({ dark: v })} /></div>
    <div className="card row">Reminders (while app is open)<Toggle on={s.notifications} onChange={notif} /></div>
    {link('Family / Caregiver', '/family')}{link('Report Vault', '/reports')}{link('Privacy & Security', '/privacy')}{link('Offline Mode', '/offline')}
    <div className="card"><b>Data</b>
      <button className="btn ghost" onClick={sync}>Sync with Supabase</button>
      <button className="btn ghost" onClick={exportData}>Export my data (JSON)</button>
      <button className="btn ghost" onClick={clearDemo}>Remove sample data</button></div>
    {msg && <p className="center" style={{ color: '#1f6feb' }}>{msg}</p>}</div>
}
