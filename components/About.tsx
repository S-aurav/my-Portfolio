"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { personalInfo } from "@/lib/data";
import { CertificationEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";
import { useProfile } from "@/context/ProfileContext";

// ── About field config (mirrors admin/profile/page.tsx) ─────────────────────

type AboutFieldConfig = {
  key: string;
  label: string;
  visible: boolean;
  value: string;
};

const DEFAULT_ABOUT_FIELDS: AboutFieldConfig[] = [
  { key: "location",  label: "Location",  visible: true, value: "" },
  { key: "email",     label: "Email",     visible: true, value: "" },
  { key: "currently", label: "Currently", visible: true, value: "Dista.ai" },
  { key: "available", label: "Available", visible: true, value: "For opportunities" },
];

function parseAboutFields(json?: string | null): AboutFieldConfig[] {
  if (!json) return DEFAULT_ABOUT_FIELDS.map(f => ({ ...f }));
  try {
    const parsed = JSON.parse(json) as AboutFieldConfig[];
    const keySet = new Set(parsed.map(f => f.key));
    const extras = DEFAULT_ABOUT_FIELDS.filter(f => !keySet.has(f.key));
    return [...parsed, ...extras];
  } catch { return DEFAULT_ABOUT_FIELDS.map(f => ({ ...f })); }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function About({ initialCerts }: { initialCerts?: CertificationEntry[] | null }) {
  const ref = useScrollReveal();
  const { profile } = useProfile();

  const [certs, setCerts] = useState<CertificationEntry[]>(initialCerts || []);

  useEffect(() => {
    if (initialCerts !== undefined && initialCerts !== null) {
      // Server is online. Cache the response (even if empty)
      localStorage.setItem("cached_certs", JSON.stringify(initialCerts));
      setCerts(initialCerts);
    } else {
      // Server is offline. Load from localStorage
      const cached = localStorage.getItem("cached_certs");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setCerts(parsed as CertificationEntry[]);
            return;
          }
        } catch {}
      }
      setCerts([]);
    }
  }, [initialCerts]);

  const name         = profile?.name        ?? personalInfo.name;
  const bio          = profile?.bio         ?? personalInfo.bio;
  const profileImage = profile?.profileImage || personalInfo.profileImage;

  // ── Resolve info-grid fields ───────────────────────────────────────────────
  const aboutFields = parseAboutFields(profile?.aboutFieldsConfig);

  const resolvedFields = aboutFields
    .filter(f => f.visible)
    .map(f => {
      let value = f.value;
      if (f.key === "location") value = f.value || profile?.location || personalInfo.location;
      if (f.key === "email")    value = f.value || profile?.email    || personalInfo.email;
      return { label: f.label, value };
    })
    .filter(f => f.value); // don't render a row whose value is empty

  return (
    <section id="about" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle">A little about me</p>

        <div className="card about-card" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div className="about-avatar-wrapper" style={{ flexShrink: 0 }}>
            <div style={{ width: 120, height: 120, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <Image
                src={profileImage}
                alt={name}
                width={120}
                height={120}
                className="object-cover"
                sizes="120px"
                unoptimized={profileImage.startsWith("http://") || profileImage.startsWith("https://")}
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '20px' }}>
              {bio}
            </p>

            {/* Info grid — driven by aboutFieldsConfig */}
            {resolvedFields.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                {resolvedFields.map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, minWidth: 70, letterSpacing: '0.02em' }}>{item.label}:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certs.length > 0 && (
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Certifications
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {certs.map((cert) => (
                    <li key={cert.id} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent)' }}>▸</span>
                      {cert.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
