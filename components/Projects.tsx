"use client";

import { useState, useEffect } from "react";
import { ProjectEntry } from "@/lib/api";
import { projects as fallbackProjects } from "@/lib/data";
import { useScrollReveal } from "@/lib/hooks";

export default function Projects({ initialProjects }: { initialProjects?: ProjectEntry[] }) {
  const ref = useScrollReveal();

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      localStorage.setItem("cached_projects", JSON.stringify(initialProjects));
    }
  }, [initialProjects]);

  const [projects] = useState<ProjectEntry[]>(() => {
    if (initialProjects && initialProjects.length > 0) {
      return initialProjects;
    }
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("cached_projects");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return mapFallbackProjects();
  });

  function mapFallbackProjects(): ProjectEntry[] {
    return fallbackProjects.map((p, idx) => ({
      id: `fallback-${idx}`,
      title: p.title,
      description: p.description,
      date: p.date,
      githubUrl: p.github || null,
      demoUrl: p.demo || null,
      techStack: p.techStack.join(","),
      visibility: "PUBLIC",
      displayOrder: idx,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  return (
    <section id="projects" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Things I've built</p>

        {false ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((project, i) => {
              const techTags = (project.techStack || "").split(",").map(t => t.trim()).filter(Boolean);
              return (
                <div key={project.id} className="card" style={{ position: 'relative' }}>
                  {/* Date badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontFamily: 'Inconsolata, monospace', fontSize: '0.76rem', color: 'var(--text-light)' }}>
                      {project.date}
                    </span>
                    {/* Links */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {project.githubUrl && (
                        <a
                          id={`project-github-${i}`}
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.18s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          id={`project-demo-${i}`}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.18s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '14px' }}>
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {techTags.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
