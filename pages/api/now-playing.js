import { getNowPlaying } from "../../utils/spotify";

export default async function handler(_, res) {
  let response;
  try {
    response = await getNowPlaying();
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({ isPlaying: false });
  }

  // 204 means nothing is playing; anything else non-2xx is a real error.
  if (response.status === 204) {
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

  const song = await response.json();

  // `item` is null for ads, and podcast episodes have no artists/album.
  if (!song.item || song.item.type !== "track") {
    return res.status(200).json({ isPlaying: false });
  }
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0]?.url ?? null;
  const songUrl = song.item.external_urls.spotify;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=30",
  );

  return res.status(200).json({
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  });
}
