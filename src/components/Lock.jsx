import { useState } from 'react'
import { Lock as L } from 'lucide-react'
import { getSettings } from '../lib/settings'
export default function Lock({ onUnlock }) {
  const [v, setV] = useState(''); const [bad, setBad] = useState(false)
  const check = (x) => { setV(x); setBad(false)
    if (x.length === 4) { if (x === getSettings().pin) { sessionStorage.setItem('bp_unlocked', '1'); onUnlock() } else { setBad(true); setV('') } } }
  return <div className="page center" style={{ minHeight: '100vh', justifyContent: 'center' }}>
    <L size={44} color="#1f6feb" /><h1 style={{ margin: '10px 0' }}>Enter PIN</h1>
    <input className="input" style={{ width: 160, textAlign: 'center', letterSpacing: 10 }} type="password" inputMode="numeric" maxLength={4} autoFocus value={v} onChange={e => check(e.target.value.replace(/\D/g, ''))} />
    {bad && <p style={{ color: '#e5484d' }}>Wrong PIN</p>}</div>
}
