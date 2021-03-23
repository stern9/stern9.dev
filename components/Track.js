export default function Track(track) {
  return (
    <div className="flex flex-row items-baseline border-b border-secondary max-w-3xl w-full mt-8">
      <p className="text-md font-bold ">{track.ranking}</p>
      <div className="flex flex-col pl-3">
        <a
          className="font-medium truncate w-60 sm:w-96 md:w-full"
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.title}
        </a>
        <p className="mb-4 truncate w-60 sm:w-96 md:w-full">{track.artist}</p>
      </div>
    </div>
  );
}
