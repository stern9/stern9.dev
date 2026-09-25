import useSWR from "swr";
import { FaSpotify } from "react-icons/fa";
import fetcher from "../utils/fetcher";

const NowPlaying = () => {
  const { data } = useSWR("/api/now-playing", fetcher);

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <FaSpotify className="h-4 w-4 shrink-0 text-[#1ED760]" aria-hidden />
      {data?.songUrl ? (
        <p className="min-w-0 truncate text-zinc-500 dark:text-zinc-400">
          <span className="sr-only">Now playing: </span>
          <a
            className="font-medium text-zinc-800 hover:underline dark:text-zinc-200"
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.title}
          </a>
          {" — "}
          {data.artist}
        </p>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400">
          Not playing — Spotify
        </p>
      )}
    </div>
  );
};

export default NowPlaying;
