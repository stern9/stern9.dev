import type { NextApiRequest, NextApiResponse } from "next";
import {
  getNowPlaying,
  type NowPlayingData,
  type SpotifyTrack,
} from "../../utils/spotify";

// Short enough that a finished track or a stopped player shows within ~30s,
// long enough that Nginx's shared cache keeps Spotify calls to a few a minute.
// Only set on real answers from Spotify, so a failed call isn't cached.
const CACHE_CONTROL =
  "public, max-age=15, s-maxage=15, stale-while-revalidate=15";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NowPlayingData>,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  let response: Response;
  try {
    response = await getNowPlaying();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return res.status(200).json({ isPlaying: false });
  }

  // 204 means nothing is playing; anything else non-2xx is a real error.
  if (response.status === 204) {
    res.setHeader("Cache-Control", CACHE_CONTROL);
    return res.status(200).json({ isPlaying: false });
  }
  if (!response.ok) {
    console.error(
      "Spotify now-playing error:",
      response.status,
      await response.text(),
    );
    return res.status(200).json({ isPlaying: false });
  }

  const song: { is_playing: boolean; item: SpotifyTrack | null } =
    await response.json();

  // `item` is null for ads, and podcast episodes have no artists/album.
  if (!song.item || song.item.type !== "track") {
    res.setHeader("Cache-Control", CACHE_CONTROL);
    return res.status(200).json({ isPlaying: false });
  }
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0]?.url ?? null;
  const songUrl = song.item.external_urls.spotify;

  res.setHeader("Cache-Control", CACHE_CONTROL);

  return res.status(200).json({
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  });
}
