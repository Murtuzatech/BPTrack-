import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Image as Img, RefreshCw } from 'lucide-react'
import { fileToPart, readBpMonitor } from '../lib/gemini'

export default function Scanner() {
  const nav = useNavigate()
  const video = useRef(); const stream = useRef(); const gal = useRef()
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [camErr, setCamErr] = useState('')

  const startCam = async () => {
    setCamErr(''); setReady(false)
    stream.current?.getTracks().forEach(t => t.stop())
    if (!navigator.mediaDevices?.getUserMedia) {
      return setCamErr('Is browser mein camera support nahi hai. Neeche Choose from Gallery use karo.')
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      stream.current = s
      video.current.srcObject = s
      await video.current.play()
      setReady(true)
    } catch (x) {
      setCamErr(x.name === 'NotAllowedError'
        ? 'Camera ki permission band hai. Address bar mein lock icon dabao, Camera ko Allow karo, phir Retry dabao.'
        : 'Camera nahi mila ya koi aur app use kar rahi hai. Retry dabao ya gallery se photo chuno.')
    }
  }

  useEffect(() => {
    startCam()
    return () => stream.current?.getTracks().forEach(t => t.stop())
  }, [])

  const process = async (file) => {
    setBusy(true); setErr('')
    try {
      const { part, preview } = await fileToPart(file)
      const values = await readBpMonitor(part)
      nav('/scan-result', { state: { img: preview, values } })
    } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }

  const capture = () => {
    const v = video.current
    if (!v || !v.videoWidth) return
    const c = document.createElement('canvas')
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d').drawImage(v, 0, 0)
    c.toBlob(b => b && process(new File([b], 'scan.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.9)
  }

  const pick = (e) => {
    const f = e.target.files[0]; if (!f) return
    process(f); e.target.value = ''
  }

  return <div className="page">
    <div className="row" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 14 }}>
      <ArrowLeft onClick={() => nav(-1)} style={{ cursor: 'pointer' }} /><h1>Scan BP Monitor</h1>
    </div>

    <div style={{ position: 'relative', background: '#14213d', borderRadius: 16, overflow: 'hidden', aspectRatio: '4 / 3', marginBottom: 14 }}>
      <video ref={video} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: ready ? 'block' : 'none' }} />
      {ready && <div style={{ position: 'absolute', inset: '18% 12%', border: '3px solid #fff', borderRadius: 14, boxShadow: '0 0 0 999px #0005', pointerEvents: 'none' }} />}
      {!ready && <div className="center" style={{ position: 'absolute', inset: 0, justifyContent: 'center', color: '#fff', padding: 20 }}>
        <Camera size={48} />
        <p style={{ marginTop: 10 }}>{camErr || 'Camera chalu ho raha hai...'}</p>
        {camErr && <button className="btn" onClick={startCam} style={{ width: 'auto', marginTop: 12, padding: '10px 18px' }}><RefreshCw size={14} /> Retry</button>}
      </div>}
    </div>

    <p className="muted" style={{ textAlign: 'center', marginBottom: 12 }}>Machine ka display frame ke andar rakho. Digits saaf aur roshni mein hon.</p>

    <input ref={gal} type="file" accept="image/*" hidden onChange={pick} />
    <button className="btn" disabled={!ready || busy} onClick={capture} style={{ opacity: !ready || busy ? .6 : 1 }}>
      <Camera size={16} /> {busy ? 'Reading display…' : 'Scan Now'}
    </button>
    <button className="btn ghost" disabled={busy} onClick={() => gal.current.click()}><Img size={16} /> Choose from Gallery</button>
    {err && <p style={{ color: '#e5484d', marginTop: 10 }}>{err}</p>}
  </div>
}