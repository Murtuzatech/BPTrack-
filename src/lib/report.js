import { jsPDF } from 'jspdf'
import { avg, classify } from './store'
export function ruleSummary(rs) {
  if (!rs.length) return 'No readings in this period.'
  const s = avg(rs.map(r => r.sys)), d = avg(rs.map(r => r.dia)), c = classify(s, d)
  const hi = rs.filter(r => r.sys >= 140 || r.dia >= 90).length
  return `Average blood pressure was ${s}/${d} mmHg (${c.label}). ${hi} of ${rs.length} readings were in the high range (140/90 or above). Keep monitoring regularly and share this report with your doctor.`
}
export function buildPdf({ user, readings, days, summary }) {
  const doc = new jsPDF(); const rs = [...readings].sort((a, b) => new Date(a.at) - new Date(b.at))
  doc.setFontSize(20); doc.setTextColor(31, 111, 235); doc.text('BPTrack', 14, 18)
  doc.setFontSize(13); doc.setTextColor(20, 33, 61); doc.text('Blood Pressure Report', 14, 26)
  doc.setFontSize(10)
  doc.text(`Patient: ${user.name}`, 14, 36)
  doc.text(`Period: last ${days} days   Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 42)
  doc.text(`Readings: ${rs.length}    Avg BP: ${avg(rs.map(r => r.sys))}/${avg(rs.map(r => r.dia))}    Avg Pulse: ${avg(rs.map(r => r.pulse))}`, 14, 48)
  const x0 = 14, y0 = 56, w = 182, h = 50
  doc.setDrawColor(210); doc.rect(x0, y0, w, h)
  if (rs.length > 1) {
    const all = rs.flatMap(r => [r.sys, r.dia]); const mn = Math.min(...all) - 5, mx = Math.max(...all) + 5
    const pt = (i, v) => [x0 + i * w / (rs.length - 1), y0 + h - (v - mn) / (mx - mn) * h]
    const lines = [['sys', [31, 111, 235]], ['dia', [34, 160, 107]]]
    lines.forEach(([k, col]) => { doc.setDrawColor(...col); doc.setLineWidth(0.6)
      for (let i = 1; i < rs.length; i++) { const [a, b] = pt(i - 1, rs[i - 1][k]); const [c, d] = pt(i, rs[i][k]); doc.line(a, b, c, d) } })
    doc.setLineWidth(0.2)
  }
  doc.setFontSize(8); doc.setTextColor(31, 111, 235); doc.text('Systolic', 16, y0 + h + 5)
  doc.setTextColor(34, 160, 107); doc.text('Diastolic', 36, y0 + h + 5)
  doc.setTextColor(20, 33, 61); doc.setFontSize(11); doc.text('Summary', 14, 120)
  doc.setFontSize(10); const lines2 = doc.splitTextToSize(summary, 182); doc.text(lines2, 14, 127)
  let y = 127 + lines2.length * 5 + 8
  doc.setFontSize(11); doc.text('Readings', 14, y); y += 6; doc.setFontSize(9)
  const head = () => { doc.setFont(undefined, 'bold'); doc.text('Date / Time', 14, y); doc.text('SYS', 80, y); doc.text('DIA', 105, y); doc.text('Pulse', 130, y); doc.text('Status', 155, y); doc.setFont(undefined, 'normal'); y += 6 }
  head()
  ;[...rs].reverse().slice(0, 60).forEach(r => {
    if (y > 278) { doc.addPage(); y = 18; head() }
    doc.text(new Date(r.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), 14, y)
    doc.text(String(r.sys), 80, y); doc.text(String(r.dia), 105, y); doc.text(String(r.pulse), 130, y); doc.text(classify(r.sys, r.dia).label, 155, y); y += 5.5
  })
  doc.setFontSize(8); doc.setTextColor(120); doc.text('This report is informational and not a medical diagnosis. Consult your doctor.', 14, 290)
  return doc
}
export function blobUrl(uri) {
  const bin = atob(uri.split(',')[1]); const u = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i)
  return URL.createObjectURL(new Blob([u], { type: 'application/pdf' }))
}
export const loadReports = () => JSON.parse(localStorage.getItem('bp_reports') || '[]')
export const saveReports = (l) => localStorage.setItem('bp_reports', JSON.stringify(l))
