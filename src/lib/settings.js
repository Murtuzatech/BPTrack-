const K = 'bp_settings'
const D = { dark: false, notifications: false, pin: '', sync: true }
export const getSettings = () => ({ ...D, ...JSON.parse(localStorage.getItem(K) || '{}') })
export function applyTheme(s = getSettings()) { document.documentElement.dataset.theme = s.dark ? 'dark' : 'light' }
export function saveSettings(p) { const s = { ...getSettings(), ...p }; localStorage.setItem(K, JSON.stringify(s)); applyTheme(s); return s }
