# BPTrack
1. `npm install`
2. Fill `.env` (see below)
3. `npm run dev`  (open the printed URL; use a phone-size window)

## .env
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  -> Supabase > Project Settings > API
VITE_GEMINI_API_KEY   -> https://aistudio.google.com/apikey
VITE_YOUTUBE_API_KEY  -> Google Cloud Console > YouTube Data API v3 > Credentials
Optional: VITE_GEMINI_MODEL (default gemini-2.5-flash)

## Supabase
Run `supabase/schema.sql` in the SQL Editor. Restart `npm run dev` after editing `.env`.
Offline caching (service worker) works in production: `npm run build && npm run preview`.
