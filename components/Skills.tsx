"use client";

import { skills } from "@/lib/data";
import { useScrollReveal } from "@/lib/hooks";

export default function Skills() {
  const ref = useScrollReveal();

  return (
    <section id="skills" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">Technologies I work with</p>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {skills.map((group) => (
            <div key={group.category}>
              <p style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '10px',
                fontFamily: 'Josefin Sans, sans-serif',
              }}>
                {group.category}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map((skill) => (
                  <span key={skill.name} className="skill-pill">
                    {skill.name}
                  </span>
                ))}
              </div>
              <div style={{ height: 1, background: 'var(--border-light)', marginTop: '20px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
