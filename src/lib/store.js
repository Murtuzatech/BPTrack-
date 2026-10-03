const KEY = 'bp_readings'
export function classify(s, d) {
  if (s < 120 && d < 80) return { label: 'Normal', color: '#22a06b', bg: '#e3f6ee' }
  if (s < 130 && d < 80) return { label: 'Elevated', color: '#b7791f', bg: '#fdf1d8' }
  if (s < 140 && d < 90) return { label: 'High (Stage 1)', color: '#d9480f', bg: '#ffe9dc' }
  return { label: 'High (Stage 2)', color: '#e5484d', bg: '#fde5e6' }
}
function seed() {
  const out = [], now = Date.now()
  const sys = [124, 130, 127, 134, 126, 129, 128], dia = [80, 85, 79, 86, 78, 83, 82]
  sys.forEach((s, i) => out.push({ id: 's' + i, demo: true, sys: s, dia: dia[i], pulse: 72 + i % 4,
    at: new Date(now - (6 - i) * 864e5).toISOString() }))
  return out
}
export function getReadings() {
  try { const r = JSON.parse(localStorage.getItem(KEY)); if (r?.length) return r } catch {}
  const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s
}
export function addReading(r) {
  const all = [...getReadings(), { id: crypto.randomUUID(), at: new Date().toISOString(), ...r }]
  localStorage.setItem(KEY, JSON.stringify(all)); import('./sync').then(m => m.pushReadings()).catch(() => {}); return all
}

export function deleteReading(id) {
  const all = getReadings().filter(r => r.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all)); return all
}
export const dayKey = (d) => new Date(d).toISOString().slice(0, 10)
export function inRange(readings, days) {
  const from = Date.now() - days * 864e5
  return readings.filter(r => new Date(r.at).getTime() >= from)
}
export const avg = (a) => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0
export function getPlan() {
  try { const p = JSON.parse(localStorage.getItem('bp_plan')); if (p) return p } catch {}
  const p = { start: dayKey(Date.now() - 6 * 864e5), morning: '08:00', evening: '20:00' }
  localStorage.setItem('bp_plan', JSON.stringify(p)); return p
}
export function savePlan(p) { localStorage.setItem('bp_plan', JSON.stringify(p)); return p }
