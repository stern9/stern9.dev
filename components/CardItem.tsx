import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import type { Project } from "../lib/projects";

const CardItem = ({
  title,
  year,
  image,
  terminal,
  previewURL,
  codeURL,
  description,
  stack = [],
}: Project) => {
  // Projects whose demo is offline have no previewURL: link to the source.
  const href = previewURL || codeURL;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden border-b border-zinc-200 dark:border-zinc-800"
        tabIndex={-1}
        aria-hidden
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={600}
            height={500}
            sizes="(min-width: 640px) 360px, 100vw"
            className="aspect-16/10 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="relative aspect-16/10 w-full overflow-hidden bg-[#07111f]">
            <pre className="p-4 font-mono text-[10px] leading-[1.6] text-zinc-300 sm:text-[11px]">
              {terminal}
            </pre>
            <div className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-[#07111f] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-[#07111f] to-transparent" />
          </div>
        )}
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <span className="text-sm tabular-nums text-zinc-400">{year}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        {stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex gap-4 text-sm font-medium">
          {previewURL && (
            <a
              href={previewURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-900 hover:text-accent dark:text-zinc-100 dark:hover:text-accent-light"
            >
              Live site <HiArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          <a
            href={codeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <FaGithub className="h-3.5 w-3.5" /> Source
          </a>
        </div>
      </div>
    </article>
  );
};

// Compact row for archived projects: title, year, one line and the source.
export const CompactCardItem = ({
  title,
  year,
  codeURL,
  description,
}: Pick<Project, "title" | "year" | "codeURL" | "description">) => (
  <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
    <div className="flex items-baseline gap-2 sm:w-48 sm:shrink-0">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </h3>
      <span className="text-xs tabular-nums text-zinc-400">{year}</span>
    </div>
    <p className="flex-1 text-sm text-zinc-500 dark:text-zinc-400">
      {description}
    </p>
    <a
      href={codeURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} source on GitHub`}
      className="inline-flex shrink-0 items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      <FaGithub className="h-3.5 w-3.5" /> Source
    </a>
  </li>
);

export default CardItem;
