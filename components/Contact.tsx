"use client";

import { personalInfo } from "@/lib/data";
import { useScrollReveal } from "@/lib/hooks";

export default function Contact() {
  const ref = useScrollReveal();

  return (
    <section id="contact" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Let's get in touch</p>

        <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 28px' }}>
            I'm open to new opportunities — full-time roles, collaborations, or just a good conversation about tech. Drop me a message anytime.
          </p>

          <a
            id="contact-email-btn"
            href={`mailto:${personalInfo.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 28px',
              border: '1px solid var(--accent)',
              borderRadius: '3px',
              color: 'var(--accent)',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
              marginBottom: '32px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent)';
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {personalInfo.email}
          </a>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 auto 24px', maxWidth: 320 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', letterSpacing: '0.06em' }}>OR FIND ME ON</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          {/* Social links row */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub', href: personalInfo.links.github },
              { label: 'LinkedIn', href: personalInfo.links.linkedin },
              { label: 'LeetCode', href: personalInfo.links.leetcode },
            ].map((link) => (
              <a
                key={link.label}
                id={`contact-social-${link.label.toLowerCase()}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '7px 18px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontFamily: 'Josefin Sans, sans-serif',
                  letterSpacing: '0.06em',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
