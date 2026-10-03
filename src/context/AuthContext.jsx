import { createContext, useContext, useState } from 'react'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
// No real authentication: any email/name logs in instantly.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('bp_user') || 'null'))
  const login = (data) => {
    const name = data.name || (data.email ? data.email.split('@')[0] : 'Guest')
    const u = { id: data.email || 'guest', email: data.email || '', age: 28, gender: 'Male',
      height: "5'8\"", weight: '72 kg', emergency: '+91 98765 43210', doctor: 'Dr. Sharma (Cardiologist)', ...data, name }
    localStorage.setItem('bp_user', JSON.stringify(u)); setUser(u)
  }
  const updateUser = (p) => { const u = { ...user, ...p }; localStorage.setItem('bp_user', JSON.stringify(u)); setUser(u) }
  const logout = () => { localStorage.removeItem('bp_user'); setUser(null) }
  return <Ctx.Provider value={{ user, login, updateUser, logout }}>{children}</Ctx.Provider>
}
