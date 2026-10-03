import { supabase } from './supabase'
import { getSettings } from './settings'
const uid = () => JSON.parse(localStorage.getItem('bp_user') || 'null')?.id
export const canSync = () => !!supabase && getSettings().sync && !!uid() && navigator.onLine
const stamp = () => localStorage.setItem('bp_last_sync', new Date().toISOString())
export async function pushReadings() {
  if (!canSync()) return
  const rows = JSON.parse(localStorage.getItem('bp_readings') || '[]').filter(r => !r.demo).map(r => ({
    user_id: uid(), id: r.id, sys: r.sys, dia: r.dia, pulse: r.pulse, taken_at: r.at, symptom: r.symptom || null, notes: r.notes || null }))
  if (rows.length) { const { error } = await supabase.from('readings').upsert(rows, { onConflict: 'user_id,id' }); if (error) throw error }
  stamp()
}
export async function pullReadings() {
  if (!canSync()) return
  const { data, error } = await supabase.from('readings').select('*').eq('user_id', uid()); if (error) throw error
  const local = JSON.parse(localStorage.getItem('bp_readings') || '[]'); const ids = new Set(local.map(r => r.id))
  const add = data.filter(r => !ids.has(r.id)).map(r => ({ id: r.id, sys: r.sys, dia: r.dia, pulse: r.pulse, at: r.taken_at, symptom: r.symptom, notes: r.notes }))
  if (add.length) localStorage.setItem('bp_readings', JSON.stringify([...local.filter(r => !r.demo || !data.length), ...add]))
  stamp()
}
export async function pushFamily(list) {
  if (!canSync()) return
  await supabase.from('family_members').delete().eq('user_id', uid())
  if (list.length) await supabase.from('family_members').insert(list.map(m => ({ user_id: uid(), id: m.id, name: m.name, relation: m.relation, sys: m.sys, dia: m.dia, pulse: m.pulse })))
}
export async function deleteRemote() {
  if (!canSync()) return
  await supabase.from('readings').delete().eq('user_id', uid()); await supabase.from('family_members').delete().eq('user_id', uid())
}
export async function syncAll() { await pullReadings(); await pushReadings() }
