import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WifiOff, Wifi } from 'lucide-react'
import { getReadings } from '../lib/store'
import { syncAll, canSync } from '../lib/sync'
export default function Offline() {
  const nav = useNavigate(); const [on, setOn] = useState(navigator.onLine); const [msg, setMsg] = useState('')
  useEffect(() => { const u = () => setOn(true), d = () => setOn(false); addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  const last = localStorage.getItem('bp_last_sync')
  const sync = async () => { try { await syncAll(); setMsg('Synced ✓') } catch (e) { setMsg(e.message) } }
  return <div className="page center" style={{ paddingTop: 60 }}>{on ? <Wifi size={64} color="#22a06b" /> : <WifiOff size={64} color="#1f6feb" />}
    <h1 style={{ margin: '12px 0' }}>{on ? 'You are online' : 'Offline Mode'}</h1>
    <p className="muted">Your data is saved locally and syncs when you are back online.</p>
    <div className="card" style={{ width: '100%', marginTop: 20 }}>
      <div className="row"><span className="muted">Local readings</span><b>{getReadings().length}</b></div>
      <div className="row" style={{ marginTop: 8 }}><span className="muted">Last sync</span><b>{last ? new Date(last).toLocaleString('en-IN') : 'Never'}</b></div></div>
    <button className="btn" disabled={!canSync()} style={{ opacity: canSync() ? 1 : .5 }} onClick={sync}>Sync now</button>
    {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    <button className="btn ghost" onClick={() => nav('/')}>Continue</button></div>
}
