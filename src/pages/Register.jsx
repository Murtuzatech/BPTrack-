import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export default function Register() {
  const { login } = useAuth(); const nav = useNavigate(); const [f, setF] = useState({ name: '', email: '' })
  const go = (e) => { e.preventDefault(); login(f); nav('/') }
  return <form className="page center" onSubmit={go} style={{ minHeight: '100vh', justifyContent: 'center' }}>
    <HeartPulse size={44} color="#1f6feb" /><h1>Create Account</h1><p className="muted" style={{ marginBottom: 20 }}>Join BPTrack today</p>
    <input className="input" placeholder="Full Name" onChange={e => setF({ ...f, name: e.target.value })} />
    <input className="input" placeholder="Email" onChange={e => setF({ ...f, email: e.target.value })} />
    <input className="input" type="password" placeholder="Password" />
    <input className="input" type="password" placeholder="Confirm Password" />
    <button className="btn">Register</button>
    <p className="muted" style={{ marginTop: 14 }}>Already have an account? <Link to="/login">Login</Link></p></form>
}
