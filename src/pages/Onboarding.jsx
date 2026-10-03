import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Sparkles, FileText } from 'lucide-react'
const slides = [
  [Activity, 'Track Your Blood Pressure', 'Keep a digital record of your BP readings and stay on top of your health.'],
  [Sparkles, 'AI Health Assistant', 'Ask questions, get insights and tips based on your readings.'],
  [FileText, 'Reports & Sharing', 'Generate PDF reports and share them with your doctor or family.']]
export default function Onboarding() {
  const [i, setI] = useState(0); const nav = useNavigate(); const [Icon, t, d] = slides[i]
  const next = () => i < 2 ? setI(i + 1) : nav('/login')
  return <div className="page center" style={{ minHeight: '100vh', justifyContent: 'center' }}>
    <div style={{ background: '#e3eeff', borderRadius: '50%', padding: 40, marginBottom: 24 }}><Icon size={80} color="#1f6feb" /></div>
    <h1>{t}</h1><p className="muted" style={{ margin: '10px 0' }}>{d}</p>
    <div className="dots">{slides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
    <button className="btn" onClick={next}>{i < 2 ? 'Next' : 'Get Started'}</button>
    <button className="btn ghost" onClick={() => nav('/login')}>Skip</button></div>
}
