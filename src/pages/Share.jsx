import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, MessageCircle, Mail, Send, Download, Copy } from 'lucide-react'
import { loadReports, blobUrl } from '../lib/report'
export default function Share() {
  const { id } = useParams(); const nav = useNavigate(); const r = loadReports().find(x => x.id === id)
  if (!r) return <div className="page"><p>Report not found.</p></div>
  const text = `BPTrack ${r.title}: average BP ${r.avg} mmHg from ${r.count} readings (${new Date(r.at).toLocaleDateString('en-IN')}).`
  const file = () => { const a = atob(r.pdf.split(',')[1]); const u = new Uint8Array(a.length); for (let i = 0; i < a.length; i++) u[i] = a.charCodeAt(i); return new File([u], `BPTrack-${r.title.replace(/\s/g, '')}.pdf`, { type: 'application/pdf' }) }
  const native = async () => { const f = file(); if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], text }); else alert('File sharing is not supported here. Download the PDF and attach it manually.') }
  const dl = () => { const a = document.createElement('a'); a.href = blobUrl(r.pdf); a.download = file().name; a.click() }
  const opts = [[Share2, 'Share PDF (device share sheet)', native],
    [MessageCircle, 'WhatsApp (summary)', () => window.open('https://wa.me/?text=' + encodeURIComponent(text))],
    [Mail, 'Gmail (summary)', () => window.open('https://mail.google.com/mail/?view=cm&su=' + encodeURIComponent('My BP Report') + '&body=' + encodeURIComponent(text))],
    [Send, 'Telegram (summary)', () => window.open('https://t.me/share/url?url=' + encodeURIComponent(location.origin) + '&text=' + encodeURIComponent(text))],
    [Download, 'Download PDF to attach', dl],
    [Copy, 'Copy summary', () => navigator.clipboard.writeText(text)]]
  return <div className="page"><div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 14 }}>
    <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => nav(-1)} /><h1>Share Report</h1></div>
    <p className="muted" style={{ marginBottom: 12 }}>{text}</p>
    {opts.map(([I, l, fn]) => <div key={l} className="card row" style={{ cursor: 'pointer', justifyContent: 'flex-start', gap: 12 }} onClick={fn}><I size={18} color="#1f6feb" />{l}</div>)}
    <p className="muted">Tip: WhatsApp/Gmail/Telegram links send the summary text. To send the PDF itself, use "Share PDF" or download and attach it.</p></div>
}
