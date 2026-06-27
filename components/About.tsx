"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { personalInfo, certifications as staticCerts } from "@/lib/data";
import { publicApi, ProfileEntry, CertificationEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";

export default function About() {
  const ref = useScrollReveal();
  const [profile, setProfile] = useState<ProfileEntry | null>(null);
  const [certs, setCerts] = useState<CertificationEntry[] | null>(null);

  useEffect(() => {
    publicApi.getProfile()
      .then(res => { if (res.data) setProfile(res.data); })
      .catch(() => {});
    publicApi.getCertifications()
      .then(res => { if (res.data?.length) setCerts(res.data); })
      .catch(() => {});
  }, []);

  const name         = profile?.name        ?? personalInfo.name;
  const bio          = profile?.bio         ?? personalInfo.bio;
  const location     = profile?.location    ?? personalInfo.location;
  const email        = profile?.email       ?? personalInfo.email;
  const profileImage = profile?.profileImage ?? personalInfo.profileImage;
  const certList     = certs ?? staticCerts.map((c, i) => ({ id: String(i), name: c, displayOrder: i, createdAt: '', updatedAt: '' }));

  return (
    <section id="about" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle">A little about me</p>

        <div className="card" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ width: 120, height: 120, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <Image
                src={profileImage}
                alt={name}
                width={120}
                height={120}
                className="object-cover"
                sizes="120px"
                unoptimized={profileImage.startsWith("http")}
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '20px' }}>
              {bio}
            </p>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Location', value: location },
                { label: 'Email', value: email },
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
            {certList.length > 0 && (
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Certifications
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {certList.map((cert) => (
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
