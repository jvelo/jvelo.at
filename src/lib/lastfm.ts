import { createContext, useContext } from 'hono/jsx';

const USER = 'g_velo';
const CACHE_SECONDS = 300;
// Last.fm serves this generic star image when it has no cover for a track.
const PLACEHOLDER_ART = '2a96cbd8b46e442fc41c2b86b821562f';

export interface LatestTrack {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
}

interface RecentTrack {
  name: string;
  url: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: { size: string; '#text': string }[];
  '@attr'?: { nowplaying?: string };
}

export const LatestTrackContext = createContext<LatestTrack | null>(null);

export function useLatestTrack(): LatestTrack | null {
  return useContext(LatestTrackContext);
}

/** Latest scrobble on the profile, or the track now playing when there is one. */
export async function fetchLatestTrack(apiKey?: string): Promise<LatestTrack | null> {
  if (!apiKey) return null;
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&limit=1&format=json&api_key=${apiKey}`;
  try {
    // cf.cacheTtl caches the response at the Cloudflare edge; other runtimes ignore it.
    const res = await fetch(url, {
      signal: AbortSignal.timeout(2000),
      cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return null;
    const data = (await res.json()) as { recenttracks?: { track?: RecentTrack | RecentTrack[] } };
    const track = [data.recenttracks?.track ?? []].flat()[0];
    if (!track) return null;
    const image = track.image.find((i) => i.size === 'large')?.['#text'] || '';
    return {
      name: track.name,
      artist: track.artist['#text'],
      album: track.album['#text'],
      url: track.url,
      image: image && !image.includes(PLACEHOLDER_ART) ? image : null,
      nowPlaying: track['@attr']?.nowplaying === 'true',
    };
  } catch (err) {
    console.error('last.fm fetch error:', err);
    return null;
  }
}
