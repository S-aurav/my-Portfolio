"use client";

import Image from "next/image";
import { personalInfo, certifications } from "@/lib/data";
import { useScrollReveal } from "@/lib/hooks";

export default function About() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle">A little about me</p>

        <div className="card" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ width: 120, height: 120, borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <Image
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                width={120}
                height={120}
                className="object-cover"
                sizes="120px"
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '20px' }}>
              {personalInfo.bio}
            </p>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Location', value: personalInfo.location },
                { label: 'Email', value: personalInfo.email },
                { label: 'Currently', value: 'Dista.ai' },
                { label: 'Available', value: 'For opportunities' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, minWidth: 70, letterSpacing: '0.02em' }}>{item.label}:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Certifications
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {certifications.map((cert) => (
                  <li key={cert} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)' }}>▸</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
