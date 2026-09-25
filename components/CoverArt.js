// Home page cover: syntax-highlighted code across the banner. The middle
// snippet is in focus; the side ones are dimmed and fade into the edges.
// Purely decorative (aria-hidden).

const CoverArt = ({ code = [] }) => {
  const [left, focus, right] = code;

  return (
    <div
      aria-hidden
      className="relative h-44 w-full overflow-hidden border-b border-zinc-200 bg-[#07111f] sm:h-56 dark:border-zinc-800"
    >
      <div className="cover-code absolute inset-0 flex items-center justify-center gap-14 px-6 font-mono text-[11px] leading-[1.75] sm:text-[13px]">
        <div
          className="hidden shrink-0 opacity-35 blur-[0.5px] lg:block"
          dangerouslySetInnerHTML={{ __html: left }}
        />
        <div
          className="cover-code-focus shrink-0"
          dangerouslySetInnerHTML={{ __html: focus }}
        />
        <div
          className="hidden shrink-0 opacity-35 blur-[0.5px] lg:block"
          dangerouslySetInnerHTML={{ __html: right }}
        />
      </div>
      {/* Fade the side snippets into the background. */}
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#07111f] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#07111f] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07111f] to-transparent" />
    </div>
  );
};

export default CoverArt;
