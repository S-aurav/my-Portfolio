"use client";

import { useState, useEffect } from "react";
import { NoteEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";
import Link from "next/link";

function getNoteSummary(content: string): string {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove markdown images
    .replace(/<video.*?>.*?<\/video>/gi, "") // remove HTML video blocks
    .replace(/<video.*?\/>/gi, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // remove links, keep text
    .replace(/#+\s+/g, "") // remove header characters
    .replace(/[\*_`~#-]/g, "") // remove formatting syntax
    .replace(/\s+/g, " ") // normalize spacing
    .trim();
}

export default function Notes({ initialNotes }: { initialNotes?: NoteEntry[] }) {
  const ref = useScrollReveal();

  useEffect(() => {
    if (initialNotes && initialNotes.length > 0) {
      localStorage.setItem("cached_notes", JSON.stringify(initialNotes));
    }
  }, [initialNotes]);

  const [notes] = useState<NoteEntry[]>(() => {
    if (initialNotes && initialNotes.length > 0) {
      return initialNotes;
    }
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("cached_notes");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return getFallbackNotes();
  });

  function getFallbackNotes(): NoteEntry[] {
    return [
      {
        id: "fallback-note-1",
        title: "Building my Digital Headquarters",
        content: "I started this platform as a permanent corner of the internet. It is not just a static portfolio; it is a modular gateway for all my apps, logs, and APIs. The backend is designed with Spring Boot, JPA, and Spring Security, featuring an active API Gateway Filter that can enable/disable sub-project endpoints in real-time. The frontend is powered by Next.js with styled vanilla CSS to give a modern, nature-inspired feel. Excited to see where this digital fortress grows.",
        category: "Architecture",
        visibility: "PUBLIC",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "fallback-note-2",
        title: "Lessons on API Gateway Scanners",
        content: "When developing the API RouteScanner module, I ran into a classic Spring dependency collision. Both the default RequestMappingHandlerMapping and the Spring Actuator ControllerEndpointHandlerMapping were candidates for constructor injection. Resolving it required a simple @Qualifier annotation. It's a reminder of how Spring manages subclass mappings and how explicit bean naming saves debug cycles during server initialization.",
        category: "Java",
        visibility: "PUBLIC",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  return (
    <section id="notes" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Notes</h2>
        <p className="section-subtitle">Logs & knowledge snippets</p>

        {false ? null : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notes.map((note) => {
              const isLong = note.content.length > 220;
              const summaryText = getNoteSummary(note.content).substring(0, 220);

              return (
                <div 
                  key={note.id} 
                  className="card" 
                  style={{ 
                    transition: 'all 0.25s ease-in-out',
                    borderLeft: '3px solid var(--accent)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'Inconsolata, monospace', fontSize: '0.74rem', color: 'var(--text-light)' }}>
                      {new Date(note.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="tag" style={{ background: 'rgba(74,144,217,0.06)', color: 'var(--accent)', fontSize: '0.68rem', padding: '2px 8px' }}>
                      {note.category}
                    </span>
                  </div>

                  <Link href={`/notes?id=${note.id}`} style={{ textDecoration: 'none' }}>
                    <h3 
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: '1.05rem', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)', 
                        marginBottom: '10px', 
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {note.title}
                    </h3>
                  </Link>

                  <p style={{ 
                    fontSize: '0.86rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.7,
                    marginBottom: '12px'
                  }}>
                    {summaryText}{isLong && "..."}
                  </p>

                  <Link 
                    href={`/notes?id=${note.id}`}
                    style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 700, 
                      color: 'var(--accent)', 
                      fontFamily: 'Josefin Sans, sans-serif',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                    className="hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
