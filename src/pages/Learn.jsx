import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TOPICS, searchVideos } from '../lib/youtube'
export default function Learn() {
  const [tab, setTab] = useState('All'); const [vids, setVids] = useState([]); const [err, setErr] = useState(''); const [play, setPlay] = useState(null)
  useEffect(() => { setErr(''); setVids([]); searchVideos(TOPICS[tab]).then(setVids).catch(e => setErr(e.message)) }, [tab])
  return <div className="page"><h1 style={{ marginBottom: 12 }}>Learn & Watch</h1>
    <div className="row" style={{ gap: 6, marginBottom: 14 }}>{Object.keys(TOPICS).map(t =>
      <button key={t} className="badge" onClick={() => setTab(t)} style={{ border: 0, cursor: 'pointer', flex: 1, padding: 8, fontSize: 11,
        background: tab === t ? '#1f6feb' : '#e3eeff', color: tab === t ? '#fff' : '#1f6feb' }}>{t}</button>)}</div>
    {err && <p style={{ color: '#e5484d' }}>{err}</p>}
    {vids.map(v => <div key={v.id} className="card row" style={{ gap: 12, justifyContent: 'flex-start', cursor: 'pointer', padding: 10 }} onClick={() => setPlay(v)}>
      <img src={v.thumb} alt="" style={{ width: 110, borderRadius: 10 }} />
      <div><b style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: v.title }} /><p className="muted">{v.channel}</p></div></div>)}
    {play && <div style={{ position: 'fixed', inset: 0, background: '#000c', zIndex: 10, display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '94%', maxWidth: 410 }}><X color="#fff" style={{ float: 'right', cursor: 'pointer' }} onClick={() => setPlay(null)} />
        <iframe title="v" style={{ width: '100%', aspectRatio: '16/9', border: 0, borderRadius: 12, marginTop: 8 }}
          src={`https://www.youtube.com/embed/${play.id}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen /></div></div>}</div>
}
