export default function Toggle({ on, onChange }) {
  return <span onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#1f6feb' : '#c5cedd', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
    <i style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: '.15s' }} /></span>
}
