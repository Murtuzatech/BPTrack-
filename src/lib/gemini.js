const KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Backup models list: If one model is busy or fails, the next one is used automatically
const MODELS = [
  import.meta.env.VITE_GEMINI_MODEL,
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash'
].filter(Boolean);

export const hasGemini = !!KEY;

const getUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;

export function fileToPart(file, maxSide = 1024) {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onerror = reject;
    rd.onload = () => {
      const dataUrl = rd.result;
      if (!file.type.startsWith('image/')) {
        return resolve({
          part: { inline_data: { mime_type: file.type, data: dataUrl.split(',')[1] } },
          preview: null,
        });
      }
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = img.width * k;
        c.height = img.height * k;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const out = c.toDataURL('image/jpeg', 0.85);
        resolve({
          part: { inline_data: { mime_type: 'image/jpeg', data: out.split(',')[1] } },
          preview: out,
        });
      };
      img.src = dataUrl;
    };
    rd.readAsDataURL(file);
  });
}

async function call(body) {
  if (!KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY in .env and restart npm run dev.');
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const res = await fetch(getUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const j = await res.json();

      if (!res.ok) {
        throw new Error(j.error?.message || `Request failed on ${model}`);
      }

      const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
      if (text) return text;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All AI models are currently busy. Please try again shortly.');
}

export const chat = (contents, system) =>
  call({ contents, systemInstruction: { parts: [{ text: system }] } });

export async function readBpMonitor(imagePart) {
  const text = await call({
    contents: [
      {
        role: 'user',
        parts: [
          imagePart,
          {
            text: 'This is a photo of a blood pressure monitor display. Read SYS, DIA and PULSE. Reply ONLY with JSON: {"sys":number|null,"dia":number|null,"pulse":number|null,"confidence":"High"|"Medium"|"Low"}',
          },
        ],
      },
    ],
    generationConfig: { responseMimeType: 'application/json' },
  });
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export const SYSTEM = (readings) =>
  `You are BPTrack's friendly AI health assistant for blood pressure. Give clear, practical, simple answers in short paragraphs or bullets. Use plain text (no markdown symbols). You are not a doctor: for very high readings (180/120 or above), chest pain, or severe symptoms, advise urgent medical help. Recent user readings (sys/dia/pulse): ${readings}`;