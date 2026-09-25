import CardItem from "./CardItem";
import { projects } from "../lib/projects";

const Projects = ({ limit }) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {projects.slice(0, limit).map((project) => (
        <CardItem key={project.title} {...project} />
      ))}
    </div>
  );
};

export default Projects;
