import { ArrowUpRight } from "lucide-react";
import { clientProjects, sideProjects } from "@/content/projects";
import type { ClientProject, SideProject } from "@/content/types";
import { Frame, FrameTitle, Heading } from "./Frame";
import { NewTabNote, StackTags } from "./ui";
import { Wireframe } from "./Wireframe";

export function Projects({ primary }: { primary: boolean }) {
  return (
    <Frame id="projects" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Projects</p>
        <FrameTitle>Things I've built</FrameTitle>
        <p className="frame-lede">
          Side projects I own end to end, and client work I led or built. Client work is described without names.
        </p>
      </header>
      <section className="projects-group" aria-labelledby="side-projects-title">
        <Heading depth={1} id="side-projects-title" className="group-title">
          Side projects
        </Heading>
        <div className="side-list">
          {sideProjects.map((p, i) => (
            <SideProjectCard key={p.slug} project={p} priority={i === 0} />
          ))}
        </div>
      </section>
      <section className="projects-group" aria-labelledby="client-work-title">
        <Heading depth={1} id="client-work-title" className="group-title">
          Client work
        </Heading>
        <div className="client-grid">
          {clientProjects.map((p) => (
            <ClientCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </Frame>
  );
}

// #region layer:project-card
function SideProjectCard({ project, priority = false }: { project: SideProject; priority?: boolean }) {
  const { image } = project;
  return (
    <article className="side-card" id={`project-${project.slug}`} data-layer="project-card">
      <picture className="side-shot">
        <source srcSet={image.avif} type="image/avif" />
        <img
          src={image.webp}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchpriority: "high" } : {})}
        />
      </picture>
      <div className="side-body">
        <Heading depth={2} className="card-title">
          {project.name}{" "}
          <span className="card-tagline">{project.tagline}</span>
        </Heading>
        <p className="card-meta">
          {project.years} · {project.role}
        </p>
        <p className="card-summary">{project.summary}</p>
        <ul className="card-points">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <StackTags items={project.stack} label={`${project.name} stack`} />
        <p className="card-links">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} <ArrowUpRight size={15} aria-hidden="true" />
              <NewTabNote />
            </a>
          ))}
        </p>
      </div>
    </article>
  );
}

function ClientCard({ project }: { project: ClientProject }) {
  return (
    <article className="client-card" data-layer="project-card">
      <Wireframe kind={project.wireframe} />
      <Heading depth={2} className="card-title">
        {project.title}
      </Heading>
      <p className="card-meta">{project.years}</p>
      <p className="card-summary">{project.summary}</p>
      <StackTags items={project.stack} label={`${project.title} stack`} />
    </article>
  );
}
// #endregion
