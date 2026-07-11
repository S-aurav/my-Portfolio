"use client";

import Link from "next/link";
import { NoteEntry } from "@/lib/api";

interface NotesListProps {
  notes: NoteEntry[];
  activeId: string | null;
}

export default function NotesList({ notes, activeId }: NotesListProps) {
  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="notes-page-list-empty">
        <p>No notes yet.</p>
      </div>
    );
  }

  return (
    <nav className="notes-page-list" aria-label="Notes list">
      <div className="notes-page-list-header">
        <span className="notes-page-list-label">All Notes</span>
        <span className="notes-page-list-count">{sorted.length}</span>
      </div>

      <ul className="notes-page-list-ul">
        {sorted.map((note) => {
          const isActive = note.id === activeId || (!activeId && note.id === sorted[0]?.id);
          return (
            <li key={note.id}>
              <Link
                href={`/notes?id=${note.id}`}
                className={`notes-page-list-item${isActive ? " notes-page-list-item--active" : ""}`}
              >
                <h3 className="notes-page-list-item-title">{note.title}</h3>
                <div className="notes-page-list-item-meta">
                  <span className="notes-page-list-item-date">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="notes-page-list-item-tag">{note.category}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
