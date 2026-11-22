import CardItem, { CompactCardItem, ProductWorkCard } from "./CardItem";
import { productWork, projects, type ProjectGroup } from "../lib/projects";

const byGroup = (group: ProjectGroup) =>
  projects.filter((p) => p.group === group);

const SectionLabel = ({ id, children }: { id: string; children: string }) => (
  <h2
    id={id}
    className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
  >
    {children}
  </h2>
);

const Projects = ({ limit }: { limit?: number }) => {
  // A limited list (the home page) shows the strongest recent work, no headers.
  if (limit) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {byGroup("recent")
          .slice(0, limit)
          .map((project) => (
            <CardItem key={project.title} {...project} />
          ))}
      </div>
    );
  }

  const sections = [
    {
      group: "recent",
      label: "Recent",
      note: "2026 tools and libraries",
    },
    {
      group: "client",
      label: "Agency work",
      note: "Prodigious / Publicis, 2018 to 2020",
    },
  ] as const;

  const section = ({ group, label, note }: (typeof sections)[number]) => (
    <section key={group} aria-labelledby={`projects-${group}`}>
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <SectionLabel id={`projects-${group}`}>{label}</SectionLabel>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">{note}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {byGroup(group).map((project) => (
          <CardItem key={project.title} {...project} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-14">
      {section(sections[0])}
      <section aria-labelledby="projects-product">
        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <SectionLabel id="projects-product">Product teams</SectionLabel>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Gorilla Logic client work, 2021 to present, private code
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {productWork.map((work) => (
            <ProductWorkCard key={work.client} {...work} />
          ))}
        </div>
      </section>
      {section(sections[1])}
      <section aria-labelledby="projects-archive">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <SectionLabel id="projects-archive">Archive</SectionLabel>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            2021 learning projects, demos offline
          </p>
        </div>
        <ul className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {byGroup("archive").map((project) => (
            <CompactCardItem key={project.title} {...project} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Projects;
