import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HeartPulse, Mail, Lock, Eye, EyeOff, ShieldCheck, LineChart, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const css = `
.lg-wrap{position:fixed;inset:0;z-index:50;overflow:auto;display:flex;background:var(--bg)}
.lg-brand{display:none;flex:1;background:linear-gradient(160deg,#1556c0,#4aa3ff);color:#fff;padding:48px;flex-direction:column;justify-content:center;gap:22px}
.lg-brand h1{font-size:34px;line-height:1.2}
.lg-brand p{opacity:.9;font-size:16px}
.lg-feat{display:flex;align-items:center;gap:12px;font-size:15px}
.lg-feat span{width:38px;height:38px;border-radius:10px;background:#ffffff26;display:flex;align-items:center;justify-content:center}
.lg-side{flex:1;display:flex;align-items:center;justify-content:center;padding:24px}
.lg-form{width:100%;max-width:400px}
.lg-logo{width:60px;height:60px;border-radius:18px;background:#1f6feb14;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.lg-field{position:relative;margin-bottom:14px}
.lg-field .ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted)}
.lg-field input{width:100%;padding:14px 44px;border:1px solid var(--line);border-radius:12px;font-size:15px;background:var(--card);color:var(--text);outline:none}
.lg-field input:focus{border-color:var(--blue);box-shadow:0 0 0 3px #1f6feb22}
.lg-field button{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:0;color:var(--muted);cursor:pointer;padding:6px;display:flex}
.lg-err{background:#e5484d14;color:var(--red);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:14px}
.lg-or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px;margin:18px 0}
.lg-or:before,.lg-or:after{content:'';flex:1;height:1px;background:var(--line)}
@media (min-width:900px){.lg-brand{display:flex}}
`

export default function Login() {
  const { login } = useAuth(); const nav = useNavigate()
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)

  const go = (e) => {
    e.preventDefault()
    if (!email.trim()) return setErr('Email ya phone number daalo')
    if (!pw) return setErr('Password daalo')
    setErr(''); setBusy(true)
    setTimeout(() => { login({ email: email.trim() }); nav('/') }, 600)
  }

  return <div className="lg-wrap">
    <style>{css}</style>
    <div className="lg-brand">
      <HeartPulse size={52} />
      <h1>BPTrack</h1>
      <p>Apna blood pressure track karo, samjho aur sahi samay par sahi kadam uthao.</p>
      <div className="lg-feat"><span><LineChart size={20} /></span>Readings ke graph aur trends</div>
      <div className="lg-feat"><span><Sparkles size={20} /></span>AI health assistant, bolkar bhi poochho</div>
      <div className="lg-feat"><span><ShieldCheck size={20} /></span>Aapka data private aur surakshit</div>
    </div>
    <div className="lg-side">
      <form className="lg-form" onSubmit={go} noValidate>
        <div className="lg-logo"><HeartPulse size={32} color="#1f6feb" /></div>
        <h1>Welcome Back</h1>
        <p className="muted" style={{ margin: '6px 0 24px' }}>Sign in to your account</p>
        {err && <div className="lg-err">{err}</div>}
        <div className="lg-field">
          <Mail className="ic" size={18} />
          <input placeholder="Email or Phone" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div className="lg-field">
          <Lock className="ic" size={18} />
          <input type={show ? 'text' : 'password'} placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
          <button type="button" onClick={() => setShow(!show)} aria-label="Show or hide password">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button className="btn" disabled={busy} style={{ opacity: busy ? .7 : 1 }}>{busy ? 'Signing in...' : 'Login'}</button>
        <div className="lg-or">or</div>
        <Link to="/register" className="btn ghost" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', border: '1px solid var(--line)' }}>Create an Account</Link>
      </form>
    </div>
  </div>
}