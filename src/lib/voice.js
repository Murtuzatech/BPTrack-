const SR = window.SpeechRecognition || window.webkitSpeechRecognition
export const voiceSupported = !!SR
let rec

export function startListening({ lang = 'hi-IN', onText, onEnd, onError }) {
  if (!SR) return onError?.('Is browser mein bolna support nahi hai. Chrome ya Edge use karo.')
  stopListening()
  rec = new SR()
  rec.lang = lang
  rec.interimResults = true
  rec.continuous = false
  rec.onresult = (e) => {
    let t = ''
    for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
    onText?.(t)
  }
  rec.onerror = (e) => onError?.(
    e.error === 'not-allowed'
      ? 'Mic ki permission band hai. Address bar ke lock icon se Microphone Allow karo.'
      : 'Awaaz samajh nahi aayi, dobara bolo.'
  )
  rec.onend = () => onEnd?.()
  rec.start()
}

export function stopListening() { try { rec?.stop() } catch {} }

export function speak(text, lang = 'hi-IN') {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  speechSynthesis.speak(u)
}

export function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel() }