"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { NoteEntry } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

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

export default function NotesContent({ initialNotes }: { initialNotes?: NoteEntry[] | null }) {
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id");

  const [notes, setNotes] = useState<NoteEntry[]>(initialNotes || []);

  useEffect(() => {
    if (initialNotes !== undefined && initialNotes !== null) {
      if (initialNotes.length > 0) {
        setNotes(initialNotes);
      } else {
        setNotes(getFallbackNotes());
      }
    } else {
      setNotes(getFallbackNotes());
    }
  }, [initialNotes]);

  // Sort notes by date (newest first)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Find active note, default to newest if not specified or not found
  const activeNote = sortedNotes.find((n) => n.id === activeId) || sortedNotes[0];

  if (sortedNotes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ color: "var(--text-light)" }}>No notes available.</p>
      </div>
    );
  }

  return (
    <div className="notes-detail-layout">
      {/* Active Note Content (Left/Center) */}
      <article className="note-article">
        <header className="note-header">
          <div className="note-meta">
            <span className="tag" style={{ background: "rgba(74,144,217,0.06)", color: "var(--accent)", fontSize: "0.74rem", padding: "2px 8px" }}>
              {activeNote.category}
            </span>
            <span style={{ fontFamily: "Inconsolata, monospace", fontSize: "0.8rem", color: "var(--text-light)" }}>
              {new Date(activeNote.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="note-title">{activeNote.title}</h1>
        </header>

        <div className="markdown-preview" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
        </div>
      </article>

      {/* Notes Navigation Sidebar (Right) */}
      <aside className="notes-list-sidebar">
        <h2 className="notes-sidebar-header">All Notes</h2>
        <ul className="notes-sidebar-list">
          {sortedNotes.map((note) => {
            const isActive = activeNote && note.id === activeNote.id;
            return (
              <li key={note.id}>
                <Link
                  href={`/notes?id=${note.id}`}
                  className={`notes-sidebar-item-link ${isActive ? "active" : ""}`}
                >
                  <h3 className="notes-sidebar-item-title">{note.title}</h3>
                  <div className="notes-sidebar-item-meta">
                    <span className="notes-sidebar-item-date">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="notes-sidebar-item-tag">{note.category}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
