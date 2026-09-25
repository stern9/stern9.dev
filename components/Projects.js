import CardItem from "./CardItem";
import { projects } from "../lib/projects";

const Projects = ({ limit }) => {
  // A limited list (the home page) features projects with a working demo.
  const list = limit
    ? [
        ...projects.filter((p) => p.previewURL),
        ...projects.filter((p) => !p.previewURL),
      ]
    : projects;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {list.slice(0, limit).map((project) => (
        <CardItem key={project.title} {...project} />
      ))}
    </div>
  );
};

export default Projects;
