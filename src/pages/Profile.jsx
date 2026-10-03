import { useNavigate } from 'react-router-dom'
import { User, Phone, Stethoscope, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export default function Profile() {
  const { user, logout } = useAuth(); const nav = useNavigate()
  const rows = [['Age', user.age], ['Gender', user.gender], ['Height', user.height], ['Weight', user.weight]]
  return <div className="page"><h1 style={{ marginBottom: 16 }}>My Profile</h1>
    <div className="card row" style={{ justifyContent: 'flex-start', gap: 14 }}>
      <User size={44} color="#1f6feb" /><div><h2>{user.name}</h2><p className="muted">{user.email}</p></div></div>
    <div className="card">{rows.map(([k, v]) => <div key={k} className="row" style={{ padding: '7px 0' }}>
      <span className="muted">{k}</span><b>{v}</b></div>)}</div>
    <div className="card row"><span><Phone size={15} /> Emergency: {user.emergency}</span></div>
    <div className="card row"><span><Stethoscope size={15} /> {user.doctor}</span></div>
    {[['Report Vault', '/reports'], ['Compare Reports', '/compare'], ['Family / Caregiver', '/family'], ['Settings', '/settings']].map(([l, p]) =>
      <div key={p} className="card row" onClick={() => nav(p)} style={{ cursor: 'pointer' }}><span><Settings size={15} /> {l}</span><span>›</span></div>)}
    <button className="btn" style={{ background: '#e5484d' }} onClick={() => { logout(); nav('/login') }}><LogOut size={15} /> Logout</button></div>
}
