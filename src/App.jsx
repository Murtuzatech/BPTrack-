import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'; import Lock from './components/Lock'
import BackBar from './components/BackBar'
import Splash from './pages/Splash'; import Onboarding from './pages/Onboarding'
import Login from './pages/Login'; import Register from './pages/Register'
import Dashboard from './pages/Dashboard'; import Profile from './pages/Profile'
import AddReading from './pages/AddReading'; import History from './pages/History'
import Analytics from './pages/Analytics'; import Monitor from './pages/Monitor'; import Session from './pages/Session'
import Scanner from './pages/Scanner'; import ScanResult from './pages/ScanResult'; import AIChat from './pages/AIChat'
import Learn from './pages/Learn'; import Insights from './pages/Insights'
import Reports from './pages/Reports'; import Share from './pages/Share'; import Compare from './pages/Compare'
import Family from './pages/Family'; import Settings from './pages/Settings'; import Privacy from './pages/Privacy'; import Offline from './pages/Offline'
import { getSettings } from './lib/settings'
import { getPlan, dayKey } from './lib/store'
import { pullReadings, pushReadings } from './lib/sync'
const pub = ['/splash', '/onboarding', '/login', '/register']
export default function App() {
  const { user } = useAuth(); const { pathname } = useLocation()
  const [locked, setLocked] = useState(() => !!getSettings().pin && !sessionStorage.getItem('bp_unlocked'))
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const u = () => { setOnline(true); pushReadings().catch(() => {}) }, d = () => setOnline(false)
    addEventListener('online', u); addEventListener('offline', d); return () => { removeEventListener('online', u); removeEventListener('offline', d) } }, [])
  useEffect(() => { if (user) pullReadings().then(pushReadings).catch(() => {}) }, [user?.id])
  useEffect(() => { const t = setInterval(() => {
    if (!getSettings().notifications || typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const p = getPlan(), now = new Date(), hm = now.toTimeString().slice(0, 5), key = dayKey(now) + hm
    if ((hm === p.morning || hm === p.evening) && localStorage.getItem('bp_last_rem') !== key) {
      localStorage.setItem('bp_last_rem', key); new Notification('BPTrack reminder', { body: 'Time to take your BP reading' }) } }, 20000)
    return () => clearInterval(t) }, [])
  const Guard = ({ children }) => user ? children : <Navigate to="/login" replace />
  const g = (path, el) => <Route path={path} element={<Guard>{el}</Guard>} />
  if (user && locked) return <div className="app"><Lock onUnlock={() => setLocked(false)} /></div>
  return <div className="app">
    {!online && <div style={{ background: '#14213d', color: '#fff', textAlign: 'center', padding: 6, fontSize: 12 }}>Offline: data is saved locally</div>}
    {user && !pub.includes(pathname) && <BackBar />}
    <Routes>
      <Route path="/splash" element={<Splash />} /><Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
      {g('/', <Dashboard />)}{g('/profile', <Profile />)}{g('/history', <History />)}{g('/monitor', <Monitor />)}
      {g('/ai', <AIChat />)}{g('/add', <AddReading />)}{g('/analytics', <Analytics />)}{g('/session', <Session />)}
      {g('/scan', <Scanner />)}{g('/scan-result', <ScanResult />)}{g('/learn', <Learn />)}{g('/insights', <Insights />)}
      {g('/reports', <Reports />)}{g('/share/:id', <Share />)}{g('/compare', <Compare />)}{g('/family', <Family />)}
      {g('/settings', <Settings />)}{g('/privacy', <Privacy />)}{g('/offline', <Offline />)}
      <Route path="*" element={<Navigate to={user ? '/' : '/splash'} replace />} />
    </Routes>
    {user && !pub.includes(pathname) && <BottomNav />}</div>
}