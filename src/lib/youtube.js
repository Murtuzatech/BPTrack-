const KEY = import.meta.env.VITE_YOUTUBE_API_KEY
export const hasYoutube = !!KEY
export const TOPICS = { All: 'blood pressure health tips', 'BP Basics': 'how to measure blood pressure correctly',
  Lifestyle: 'lifestyle changes to lower blood pressure', Nutrition: 'diet for high blood pressure DASH' }
export async function searchVideos(q) {
  if (!KEY) throw new Error('YouTube API key missing. Add VITE_YOUTUBE_API_KEY in .env and restart npm run dev.')
  const u = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&safeSearch=strict&videoEmbeddable=true&q=${encodeURIComponent(q)}&key=${KEY}`
  const j = await (await fetch(u)).json()
  if (j.error) throw new Error(j.error.message)
  return j.items.map(v => ({ id: v.id.videoId, title: v.snippet.title, channel: v.snippet.channelTitle, thumb: v.snippet.thumbnails.medium.url }))
}
