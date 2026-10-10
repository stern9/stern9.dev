const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=10`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// What the site's API routes send to the browser.
export type Track = { artist: string; songUrl: string; title: string };

export type TopTracksData = {
  tracks: Track[];
  blurb?: string | null;
  blurbPending?: boolean;
};

export type NowPlayingData =
  | { isPlaying: false; songUrl?: undefined }
  | {
      isPlaying: boolean;
      album: string;
      albumImageUrl: string | null;
      artist: string;
      songUrl: string;
      title: string;
    };

// The parts of Spotify's track object that the site reads.
export type SpotifyTrack = {
  type: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

// Access tokens last an hour; reuse one instead of fetching a new token on
// every request (which could get us rate-limited by Spotify).
let cached: { token: string | null; expiresAt: number } = {
  token: null,
  expiresAt: 0,
};

const getAccessToken = async (): Promise<string> => {
  if (cached.token && Date.now() < cached.expiresAt) return cached.token;

  const {
    SPOTIFY_CLIENT_ID: client_id,
    SPOTIFY_CLIENT_SECRET: client_secret,
    SPOTIFY_REFRESH_TOKEN: refresh_token,
  } = process.env;
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Spotify credentials are not configured");
  }
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token }),
  });
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    // invalid_grant usually means the refresh token expired (6-month limit)
    // or was revoked: generate a new one and update .env.
    throw new Error(
      `Spotify token error ${response.status}: ${data.error} - ${data.error_description}`,
    );
  }

  const token: string = data.access_token;
  cached = {
    token,
    // Refresh a minute early to avoid using a token right as it expires.
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return token;
};

const spotifyGet = async (url: string) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${await getAccessToken()}` },
  });
  // A rejected token: drop it so the next request fetches a fresh one.
  if (response.status === 401) cached = { token: null, expiresAt: 0 };
  return response;
};

export const getNowPlaying = () => spotifyGet(NOW_PLAYING_ENDPOINT);

export const getTopTracks = () => spotifyGet(TOP_TRACKS_ENDPOINT);
