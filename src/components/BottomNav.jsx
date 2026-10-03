import { NavLink } from 'react-router-dom'
import { Home, Clock, Activity, Sparkles, User } from 'lucide-react'
const items = [['/', Home, 'Home'], ['/history', Clock, 'History'], ['/monitor', Activity, 'Monitor'],
  ['/ai', Sparkles, 'AI'], ['/profile', User, 'Profile']]
export default function BottomNav() {
  return <nav className="nav">{items.map(([to, I, l]) =>
    <NavLink key={to} to={to} end className={({ isActive }) => isActive ? 'active' : ''}><I size={21} />{l}</NavLink>)}</nav>
}
