"use client";

import { useEffect, useState } from "react";
import { experiences as staticExperiences } from "@/lib/data";
import { publicApi, ExperienceEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";

function safeParseArray(json: string | null | undefined): string[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export default function Experience() {
  const ref = useScrollReveal();
  const [items, setItems] = useState<ExperienceEntry[] | null>(null);

  useEffect(() => {
    publicApi.getExperience()
      .then(res => { if (res.data?.length) setItems(res.data); })
      .catch(() => {});
  }, []);

  // If API returned data, use it; otherwise fall back to static data shaped as ExperienceEntry
  const experiences = items ?? staticExperiences.map((e, i) => ({
    id: String(i),
    role: e.role,
    company: e.company,
    duration: e.duration,
    type: e.type,
    location: e.location,
    highlights: JSON.stringify(e.highlights),
    techStack: JSON.stringify(e.techStack ?? []),
    displayOrder: i,
    createdAt: '',
    updatedAt: '',
  }));

  return (
    <section id="experience" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">Where I've worked &amp; studied</p>

        <div className="card">
          <div className="timeline">
            {experiences.map((exp) => {
              const highlights = safeParseArray(exp.highlights);
              const techStack  = safeParseArray(exp.techStack);

              return (
                <div key={exp.id} className="timeline-item">
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {exp.role}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                        {exp.company}
                        {exp.type === 'work' && (
                          <span style={{ marginLeft: 8, padding: '1px 8px', fontSize: '0.7rem', border: '1px solid var(--accent)', borderRadius: '0', color: 'var(--accent)', letterSpacing: '0.04em' }}>
                            Current
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'Inconsolata, monospace' }}>{exp.duration}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{exp.location}</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                      {highlights.map((point, j) => (
                        <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>▸</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech tags */}
                  {techStack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                      {techStack.map((tech) => (
                        <span key={tech} className="tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
