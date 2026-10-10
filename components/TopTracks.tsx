import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Track from "../components/Track";
import type { TopTracksData } from "../utils/spotify";

export default function TopTracks() {
  const { data } = useSWR<TopTracksData>("/api/top-tracks", fetcher, {
    // The first blurb is written in the background: check back until it lands.
    refreshInterval: (latest) => (latest?.blurbPending ? 3000 : 0),
  });

  if (!data?.tracks?.length) {
    return null;
  }

  return (
    <>
      {data.blurb && (
        <figure className="mb-6 border-l-2 border-zinc-300 pl-4 dark:border-zinc-700">
          <blockquote className="italic text-zinc-700 dark:text-zinc-300">
            &ldquo;{data.blurb}&rdquo;
          </blockquote>
          <figcaption className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>&mdash; Claude, an AI with opinions about my playlist</span>
            <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-xs uppercase tracking-wide dark:border-zinc-700">
              AI-generated
            </span>
          </figcaption>
        </figure>
      )}
      <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {data.tracks.map((track, index) => (
          <Track ranking={index + 1} key={track.songUrl} {...track} />
        ))}
      </ol>
    </>
  );
}
