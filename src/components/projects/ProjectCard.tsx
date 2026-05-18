import Link from "next/link";
import type { Project } from "@/types/database";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <Link href={`/projects/${project.id}`}>
        <h2 className="text-lg font-semibold group-hover:text-accent">{project.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}
