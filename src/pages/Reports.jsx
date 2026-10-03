import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, Download, Share2, Trash2, ArrowLeftRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getReadings, inRange, avg } from '../lib/store'
import { buildPdf, ruleSummary, blobUrl, loadReports, saveReports } from '../lib/report'
import { chat, SYSTEM, hasGemini } from '../lib/gemini'
export default function Reports() {
  const { user } = useAuth(); const nav = useNavigate()
  const [list, setList] = useState(loadReports()); const [days, setDays] = useState(30); const [ai, setAi] = useState(true); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const gen = async () => {
    setBusy(true); setErr('')
    try {
      const rs = inRange(getReadings(), days); let summary = ruleSummary(rs)
      if (ai && hasGemini && rs.length) { try { summary = await chat([{ role: 'user', parts: [{ text: 'Write a 4-sentence plain-text summary of this blood pressure period for a doctor report, with 2 short lifestyle tips.' }] }], SYSTEM(rs.map(r => `${r.sys}/${r.dia}/${r.pulse}`).join(', '))) } catch {} }
      const doc = buildPdf({ user, readings: rs, days, summary })
      const e = { id: crypto.randomUUID(), title: `${days}-Day Report`, days, at: new Date().toISOString(), avg: `${avg(rs.map(r => r.sys))}/${avg(rs.map(r => r.dia))}`, count: rs.length, pdf: doc.output('datauristring') }
      const next = [e, ...list]; saveReports(next); setList(next)
    } catch (x) { setErr('Could not save report: ' + x.message) } finally { setBusy(false) }
  }
  const dl = (r) => { const a = document.createElement('a'); a.href = blobUrl(r.pdf); a.download = `BPTrack-${r.title.replace(/\s/g, '')}-${r.at.slice(0, 10)}.pdf`; a.click() }
  const del = (id) => { const n = list.filter(r => r.id !== id); saveReports(n); setList(n) }
  const pill = (a) => ({ border: 0, cursor: 'pointer', flex: 1, padding: 8, background: a ? '#1f6feb' : '#e3eeff', color: a ? '#fff' : '#1f6feb' })
  return <div className="page"><div className="row" style={{ marginBottom: 14 }}><h1>Report Vault</h1>
    <ArrowLeftRight color="#1f6feb" style={{ cursor: 'pointer' }} onClick={() => nav('/compare')} /></div>
    <div className="card"><b>Generate Report</b>
      <div className="row" style={{ gap: 6, margin: '10px 0' }}>{[[7, '7 Days'], [30, '30 Days'], [90, '3 Months']].map(([d, l]) =>
        <button key={d} className="badge" style={pill(days === d)} onClick={() => setDays(d)}>{l}</button>)}</div>
      {hasGemini && <label className="muted" style={{ display: 'block', marginBottom: 10 }}><input type="checkbox" checked={ai} onChange={e => setAi(e.target.checked)} /> Include AI summary</label>}
      <button className="btn" disabled={busy} onClick={gen}>{busy ? 'Generating…' : 'Generate PDF'}</button>
      {err && <p style={{ color: '#e5484d', marginTop: 8 }}>{err}</p>}</div>
    <h2 style={{ margin: '4px 0 10px' }}>My Reports</h2>
    {!list.length && <p className="muted center">No reports yet.</p>}
    {list.map(r => <div key={r.id} className="card"><div className="row" style={{ justifyContent: 'flex-start', gap: 10 }}><FileText color="#1f6feb" />
      <div><b>{r.title}</b><p className="muted">{new Date(r.at).toLocaleDateString('en-IN', { dateStyle: 'medium' })} • Avg {r.avg} • {r.count} readings</p></div></div>
      <div className="row" style={{ marginTop: 10 }}>
        <span style={{ cursor: 'pointer', color: '#1f6feb' }} onClick={() => window.open(blobUrl(r.pdf))}><Eye size={15} /> View</span>
        <span style={{ cursor: 'pointer', color: '#1f6feb' }} onClick={() => dl(r)}><Download size={15} /> Download</span>
        <span style={{ cursor: 'pointer', color: '#1f6feb' }} onClick={() => nav(`/share/${r.id}`)}><Share2 size={15} /> Share</span>
        <Trash2 size={15} color="#7a869a" style={{ cursor: 'pointer' }} onClick={() => del(r.id)} /></div></div>)}</div>
}
