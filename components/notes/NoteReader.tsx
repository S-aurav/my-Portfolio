"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NoteEntry } from "@/lib/api";

interface NoteReaderProps {
  note: NoteEntry | null;
}

export default function NoteReader({ note }: NoteReaderProps) {
  if (!note) {
    return (
      <div className="notes-page-reader-empty">
        <p>Select a note to read.</p>
      </div>
    );
  }

  return (
    <article className="notes-page-reader">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="notes-page-reader-header">
        <div className="notes-page-reader-meta">
          <span className="notes-page-reader-tag">{note.category}</span>
          <span className="notes-page-reader-date">
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="notes-page-reader-title">{note.title}</h1>
      </header>

      {/* ── Markdown Content ────────────────────────────────── */}
      <div className="notes-page-reader-body markdown-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>
    </article>
  );
}

