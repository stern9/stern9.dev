export default function Track(track) {
  return (
    <li className="flex items-baseline gap-4 py-3">
      <span className="w-5 shrink-0 text-right font-mono text-sm tabular-nums text-zinc-400">
        {track.ranking}
      </span>
      <div className="min-w-0">
        <a
          className="block truncate font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.title}
        </a>
        <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
          {track.artist}
        </p>
      </div>
    </li>
  );
}
