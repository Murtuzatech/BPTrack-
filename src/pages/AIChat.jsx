import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Paperclip, Sparkles, PlayCircle, Mic, Square } from 'lucide-react'
import { chat, SYSTEM, fileToPart } from '../lib/gemini'
import { getReadings } from '../lib/store'
import { startListening, stopListening } from '../lib/voice'
const KEY = 'bp_chat'
const HELLO = { role: 'model', text: 'Hi! I am your BP assistant. Ask me about your readings, or attach a report/photo and I will explain it.' }
export default function AIChat() {
  const nav = useNavigate(); const end = useRef(); const file = useRef(); const textRef = useRef('')
  const [msgs, setMsgs] = useState(() => JSON.parse(localStorage.getItem(KEY) || 'null') || [HELLO])
  const [text, setText] = useState(''); const [att, setAtt] = useState(null); const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false); const [micErr, setMicErr] = useState('')
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(msgs.slice(-40))); end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => () => stopListening(), [])
  const send = async (q = text) => {
    if ((!q.trim() && !att) || busy) return
    const userMsg = { role: 'user', text: q || 'Please explain this report.', img: att?.preview }
    const next = [...msgs, userMsg]; setMsgs(next); setText(''); setBusy(true)
    const attached = att; setAtt(null)
    try {
      const hist = next.filter(m => m !== HELLO).slice(-12)
      const contents = hist.map((m, i) => ({ role: m.role, parts: [{ text: m.text }, ...(i === hist.length - 1 && attached ? [attached.part] : [])] }))
      const recent = getReadings().slice(-10).map(r => `${r.sys}/${r.dia}/${r.pulse}`).join(', ')
      setMsgs([...next, { role: 'model', text: await chat(contents, SYSTEM(recent)) }])
    } catch (e) { setMsgs([...next, { role: 'model', text: '⚠️ ' + e.message }]) } finally { setBusy(false) }
  }
  const toggleMic = () => {
    if (listening) { stopListening(); return }
    setMicErr(''); textRef.current = ''; setListening(true)
    startListening({
      lang: 'hi-IN',
      onText: (t) => { textRef.current = t; setText(t) },
      onEnd: () => { setListening(false); if (textRef.current.trim()) send(textRef.current) },
      onError: (m) => { setMicErr(m); setListening(false) }
    })
  }
  const pick = async (e) => { const f = e.target.files[0]; if (f) setAtt({ ...(await fileToPart(f)), name: f.name }); e.target.value = '' }
  const chips = ['My BP is 150/92, what does it mean?', 'Tips to lower BP naturally', 'When should I see a doctor?']
  return <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 76px)' }}>
    <div className="row" style={{ padding: '14px 18px', background: 'var(--card)', borderBottom: '1px solid #e6ebf3' }}>
      <b><Sparkles size={16} color="#1f6feb" /> AI Health Assistant</b>
      <PlayCircle color="#1f6feb" style={{ cursor: 'pointer' }} onClick={() => nav('/learn')} /></div>
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      {msgs.map((m, i) => <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: '84%', padding: '10px 13px', borderRadius: 14, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.45,
          background: m.role === 'user' ? '#1f6feb' : 'var(--card)', color: m.role === 'user' ? '#fff' : 'var(--text)' }}>
          {m.img && <img src={m.img} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 6 }} />}{m.text}</div></div>)}
      {busy && <p className="muted">Thinking…</p>}
      {msgs.length < 2 && chips.map(c => <button key={c} className="badge" onClick={() => send(c)}
        style={{ display: 'block', margin: '6px 0', border: '1px solid #cfe0ff', background: '#fff', color: '#1f6feb', cursor: 'pointer', padding: '8px 12px' }}>{c}</button>)}
      <div ref={end} /></div>
    {att && <p className="muted" style={{ padding: '0 18px' }}>📎 {att.name}</p>}
    {micErr && <p style={{ padding: '0 18px', color: '#e5484d', fontSize: 13 }}>{micErr}</p>}
    <div className="row" style={{ gap: 8, padding: 10, background: 'var(--card)', borderTop: '1px solid #e6ebf3' }}>
      <input ref={file} type="file" accept="image/*,application/pdf" hidden onChange={pick} />
      <Paperclip style={{ cursor: 'pointer', color: '#7a869a' }} onClick={() => file.current.click()} />
      <input className="input" style={{ marginBottom: 0 }} placeholder={listening ? 'सुन रहा हूँ… बोलिए' : 'Type your message…'} value={text}
        onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
      <button className="btn" onClick={toggleMic} aria-label="Bolkar poochho"
        style={{ width: 46, padding: 12, background: listening ? '#e5484d' : '#22a06b' }}>
        {listening ? <Square size={16} /> : <Mic size={16} />}</button>
      <button className="btn" style={{ width: 46, padding: 12 }} onClick={() => send()}><Send size={16} /></button></div></div>
}