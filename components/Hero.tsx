"use client";

import { useEffect, useState } from "react";
import { personalInfo } from "@/lib/data";
import { publicApi, ProfileEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";

export default function Hero() {
  const ref = useScrollReveal();
  const [profile, setProfile] = useState<ProfileEntry | null>(null);

  useEffect(() => {
    publicApi.getProfile()
      .then(res => { if (res.data) setProfile(res.data); })
      .catch(() => { /* silently fall back to static data */ });
  }, []);

  const name     = profile?.name      ?? personalInfo.name;
  const role     = profile?.role      ?? personalInfo.role;
  const location = profile?.location  ?? personalInfo.location;
  const tagline  = profile?.tagline   ?? personalInfo.tagline;
  const email    = profile?.email     ?? personalInfo.email;

  return (
    <section id="hero" className="section" style={{ paddingTop: 0 }}>
      <div ref={ref} className="reveal card card-large">
        {/* Greeting line */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Hello, World!
        </p>

        {/* Name headline */}
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2 }}>
          I'm <span style={{ color: 'var(--accent)' }}>{name}</span>
        </h2>

        {/* Role */}
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
          {role} · {location}
        </p>

        {/* Divider */}
        <div style={{ width: '48px', height: '2px', background: 'var(--accent)', marginBottom: '20px', borderRadius: '0' }} />

        {/* Tagline */}
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '600px' }}>
          {tagline}
        </p>

        {/* Quick action links */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
          <a
            id="hero-view-projects"
            href="#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 22px',
              border: '1px solid var(--accent)',
              borderRadius: '0px',
              color: 'var(--accent)',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = 'var(--accent)';
              (e.target as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'transparent';
              (e.target as HTMLElement).style.color = 'var(--accent)';
            }}
          >
            View Projects →
          </a>
          <a
            id="hero-contact"
            href={`mailto:${email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 22px',
              border: '1px solid var(--border-color)',
              borderRadius: '0px',
              color: 'var(--text-secondary)',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--accent)';
              (e.target as HTMLElement).style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
              (e.target as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
