import type { NextApiRequest, NextApiResponse } from "next";
import {
  getTopTracks,
  type SpotifyTrack,
  type TopTracksData,
} from "../../utils/spotify";
import { getTrackBlurb } from "../../lib/trackBlurb";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<TopTracksData>,
) {
  let response: Response;
  try {
    response = await getTopTracks();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
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

  const data: { items?: SpotifyTrack[] } = await response.json();
  const items = data.items || [];

  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  const blurb = getTrackBlurb(tracks);

  res.setHeader(
    "Cache-Control",
    // While the first blurb is being written the page polls for it, so that
    // response must not be cached.
    blurb.pending
      ? "no-store"
      : "public, s-maxage=86400, stale-while-revalidate=43200",
  );

  return res.status(200).json({
    tracks,
    blurb: blurb.text,
    blurbPending: blurb.pending,
  });
}
