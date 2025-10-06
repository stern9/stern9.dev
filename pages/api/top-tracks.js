import { getTopTracks } from "../../utils/spotify";

export default async (_, res) => {
  const response = await getTopTracks();

  if (response.status !== 200) {
    console.error('Spotify API error:', response.status, await response.text());
    return res.status(200).json({ tracks: [] });
  }

  const data = await response.json();
  const items = data.items || [];

  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  return res.status(200).json({ tracks });
};
