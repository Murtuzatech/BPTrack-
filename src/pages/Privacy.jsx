import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Toggle from '../components/Toggle'
import { useAuth } from '../context/AuthContext'
import { getSettings, saveSettings } from '../lib/settings'
import { deleteRemote } from '../lib/sync'
export default function Privacy() {
  const nav = useNavigate(); const { logout } = useAuth(); const [s, setS] = useState(getSettings()); const [msg, setMsg] = useState('')
  const upd = (x) => setS(saveSettings(x))
  const pin = (on) => { if (!on) return upd({ pin: '' })
    const v = window.prompt('Choose a 4-digit PIN'); if (/^\d{4}$/.test(v || '')) upd({ pin: v }); else setMsg('PIN must be 4 digits') }
  const cam = async () => { try { (await navigator.mediaDevices.getUserMedia({ video: true })).getTracks().forEach(t => t.stop()); setMsg('Camera allowed ✓') } catch { setMsg('Camera blocked: allow it in browser settings') } }
  const notif = async () => { if (typeof Notification === 'undefined') return setMsg('Notifications not supported'); const r = await Notification.requestPermission(); setMsg('Notifications: ' + r); if (r === 'granted') upd({ notifications: true }) }
  const del = async () => { if (!window.confirm('Delete all your data from this device and the cloud?')) return
    try { await deleteRemote() } catch {} ; localStorage.clear(); sessionStorage.clear(); logout(); nav('/login') }
  return <div className="page"><div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 14 }}>
    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => nav(-1)} /><h1>Privacy & Security</h1></div>
    <div className="card row"><span>App PIN lock<br /><span className="muted">Ask for a PIN when the app opens</span></span><Toggle on={!!s.pin} onChange={pin} /></div>
    <div className="card row"><span>Cloud sync (Supabase)<br /><span className="muted">Turn off to keep data only on this device</span></span><Toggle on={s.sync} onChange={v => upd({ sync: v })} /></div>
    <div className="card"><b>App Permissions</b><button className="btn ghost" onClick={cam}>Allow Camera</button><button className="btn ghost" onClick={notif}>Allow Notifications</button></div>
    <div className="card"><details><summary><b>Privacy Policy</b></summary><p className="muted" style={{ marginTop: 8 }}>Your readings are stored on this device. If cloud sync is on, they are also stored in your Supabase project. Photos and chat messages you send to the AI assistant or scanner are processed by Google Gemini. BPTrack gives general information and is not a medical diagnosis.</p></details></div>
    {msg && <p className="center" style={{ color: '#1f6feb' }}>{msg}</p>}
    <button className="btn" style={{ background: '#e5484d' }} onClick={del}>Delete Account & Data</button></div>
}
