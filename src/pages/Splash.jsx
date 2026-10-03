import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
export default function Splash() {
  const nav = useNavigate()
  useEffect(() => { const t = setTimeout(() => nav('/onboarding', { replace: true }), 1800); return () => clearTimeout(t) }, [])
  return <div className="splash center"><HeartPulse size={72} /><h1 style={{ fontSize: 34 }}>BPTrack</h1>
    <p>Track • Understand • Improve • Share</p></div>
}
