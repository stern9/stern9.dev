import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Track from "../components/Track";

export default function TopTracks() {
  const { data } = useSWR("/api/top-tracks", fetcher);

  if (!data?.tracks?.length) {
    return null;
  }

  return (
    <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {data.tracks.map((track, index) => (
        <Track ranking={index + 1} key={track.songUrl} {...track} />
      ))}
    </ol>
  );
}
