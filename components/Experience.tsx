"use client";

import { experiences } from "@/lib/data";
import { useScrollReveal } from "@/lib/hooks";

export default function Experience() {
  const ref = useScrollReveal();

  return (
    <section id="experience" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">Where I've worked & studied</p>

        <div className="card">
          <div className="timeline">
            {experiences.map((exp, i) => (
              <div key={i} className="timeline-item">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {exp.role}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                      {exp.company}
                      {exp.type === 'work' && (
                        <span style={{ marginLeft: 8, padding: '1px 8px', fontSize: '0.7rem', border: '1px solid var(--accent)', borderRadius: '2px', color: 'var(--accent)', letterSpacing: '0.04em' }}>
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
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                  {exp.highlights.map((point, j) => (
                    <li key={j} style={{ display: 'flex', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>▸</span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                {exp.techStack && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                    {exp.techStack.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
