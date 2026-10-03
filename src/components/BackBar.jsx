import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const MAIN = ['/', '/history', '/monitor', '/ai', '/profile']
const HAS_OWN = ['/scan']

export default function BackBar() {
  const nav = useNavigate(); const { pathname } = useLocation()
  if (MAIN.includes(pathname) || HAS_OWN.includes(pathname)) return null
  const back = () => (window.history.length > 1 ? nav(-1) : nav('/'))
  return <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 18px 0' }}>
    <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 0, color: 'var(--blue)', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
      <ArrowLeft size={18} /> Back
    </button>
  </div>
}