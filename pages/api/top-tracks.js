import { getTopTracks } from "../../utils/spotify";

export default async function handler(_, res) {
  let response;
  try {
    response = await getTopTracks();
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({ tracks: [] });
  }

  if (!response.ok) {
    console.error(
      "Spotify top-tracks error:",
      response.status,
      await response.text(),
    );
    return res.status(200).json({ tracks: [] });
  }

  const data = await response.json();
  const items = data.items || [];

  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200",
  );

  return res.status(200).json({ tracks });
}
