"use client";

import { useEffect, useState, useRef } from "react";
import { adminApi, NoteEntry, NoteFormData } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default function AdminNotes() {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteEntry | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNoteExpand = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "UNLISTED">("PUBLIC");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">("split");

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await adminApi.getAllNotes();
      setNotes(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("");
    setVisibility("PUBLIC");
    setError("");
    setPreviewMode(isMobile ? "edit" : "split");
    setModalOpen(true);
  }

  function openEditModal(note: NoteEntry) {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setVisibility(note.visibility);
    setError("");
    setPreviewMode(isMobile ? "edit" : "split");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const body: NoteFormData = {
      title,
      content,
      category,
      visibility,
    };

    try {
      if (editingNote) {
        await adminApi.updateNote(editingNote.id, body);
      } else {
        await adminApi.createNote(body);
      }
      setModalOpen(false);
      fetchNotes();
    } catch (err: any) {
      setError(err.message || "Failed to save note");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await adminApi.deleteNote(id);
      fetchNotes();
    } catch (err: any) {
      alert(err.message || "Failed to delete note");
    }
  }

  // Markdown Helper Actions
  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("note-content-input") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    const replacement = before + selection + after;

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selection.length);
    }, 0);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Max upload size reached (2MB limit). Please compress the media.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      const url = res.data.url;

      const isVideo = file.type.startsWith("video/");
      const tag = isVideo 
        ? `\n<video src="${url}" controls style="max-width:100%; border-radius:4px;" />\n` 
        : `\n![${file.name}](${url})\n`;

      insertText(tag);
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        await handleFileUpload(file);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await handleFileUpload(file);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            Manage Notes
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Publish notes, knowledge logs, and thoughts in Markdown format
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            padding: "10px 20px", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 4, fontFamily: "Josefin Sans, sans-serif",
            fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.18s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover, #357ebd)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
        >
          + Add Note
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No notes added yet.</p>
          <button onClick={openCreateModal} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Write your first note →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {notes.map(note => {
            const isLong = note.content.length > 220;
            const isExpanded = expandedNotes[note.id];
            const summaryText = getNoteSummary(note.content).substring(0, 220);

            return (
              <div key={note.id} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {note.title}
                    </h3>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                      background: note.visibility === "PUBLIC" ? "rgba(72,187,120,0.12)" : note.visibility === "PRIVATE" ? "rgba(229,62,62,0.12)" : "rgba(128,90,213,0.12)",
                      color: note.visibility === "PUBLIC" ? "#48bb78" : note.visibility === "PRIVATE" ? "#e53e3e" : "#805ad5",
                    }}>
                      {note.visibility}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Category: <span className="tag" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>{note.category}</span> · Published: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => openEditModal(note)}
                    style={{
                      padding: "6px 12px", border: "1px solid var(--border-color)", borderRadius: 4,
                      background: "transparent", color: "var(--text-secondary)", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{
                      padding: "6px 12px", border: "1px solid #fed7d7", borderRadius: 4,
                      background: "transparent", color: "#e53e3e", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {isExpanded ? (
                <div className="markdown-preview" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                </div>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: isLong ? "12px" : "0px" }}>
                  {summaryText}{isLong && "..."}
                </p>
              )}
              {isLong && (
                <button
                  onClick={() => toggleNoteExpand(note.id)}
                  style={{
                    background: "none", border: "none", color: "var(--accent)",
                    fontSize: "0.76rem", fontWeight: 700, padding: 0, marginTop: 8,
                    cursor: "pointer", fontFamily: "Josefin Sans, sans-serif",
                    letterSpacing: "0.04em", textTransform: "uppercase"
                  }}
                >
                  {isExpanded ? "Collapse ↑" : "Read More ↓"}
                </button>
              )}
            </div>
          );})}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        style={{ display: "none" }}
      />

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          padding: 16,
        }}>
          <div className="card" style={{ width: "98vw", maxWidth: "1350px", height: "94vh", maxHeight: "95vh", padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {editingNote ? "Edit Note" : "Write Note"}
              </h2>
              {/* Preview Mode Selector — Edit/Preview only on mobile; Split available on desktop */}
              <div style={{ display: "flex", gap: 4, background: "var(--border-color)", padding: 2, borderRadius: 4 }}>
                {(["edit", "preview", ...(isMobile ? [] : ["split"])] as ("edit" | "preview" | "split")[]).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    style={{
                      padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700, border: "none", borderRadius: 3,
                      background: previewMode === mode ? "var(--accent)" : "transparent",
                      color: previewMode === mode ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s",
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: isMobile ? 8 : 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                    Title
                  </label>
                  <input
                    type="text" value={title} onChange={e => setTitle(e.target.value)} required
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", color: "var(--text-primary)", outline: "none", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                    Category
                  </label>
                  <input
                    type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Tech"
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", color: "var(--text-primary)", outline: "none", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>
                    Visibility
                  </label>
                  <select
                    value={visibility} onChange={e => setVisibility(e.target.value as any)}
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", color: "var(--text-primary)", outline: "none", fontSize: "0.85rem" }}
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="UNLISTED">UNLISTED</option>
                  </select>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", background: "var(--bg-main)", padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border-color)" }}>
                <button type="button" onClick={() => insertText("**", "**")} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "var(--bg-white)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>B</button>
                <button type="button" onClick={() => insertText("*", "*")} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "var(--bg-white)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer", fontStyle: "italic" }}>I</button>
                <button type="button" onClick={() => insertText("### ")} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "var(--bg-white)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer" }}>H3</button>
                <button type="button" onClick={() => insertText("```\n", "\n```")} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "var(--bg-white)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer", fontFamily: "monospace" }}>Code</button>
                <button type="button" onClick={() => insertText("[", "](url)")} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "var(--bg-white)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer" }}>Link</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--border-color)", background: "rgba(74,144,217,0.1)", color: "var(--accent)", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
                  {uploading ? "Uploading..." : "Upload Media 📁"}
                </button>
                <span style={{ fontSize: "0.68rem", color: "var(--text-light)", marginLeft: "auto", alignSelf: "center" }}>
                  💡 Drag & Drop media directly into the editor pane
                </span>
              </div>

              {/* Editor Workspace */}
              <div style={{ display: "flex", gap: 16, flex: 1, overflow: "hidden", minHeight: 280 }}>
                {/* Left Pane: Editor */}
                {(previewMode === "edit" || previewMode === "split") && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                    <textarea
                      id="note-content-input"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      required
                      placeholder="Write your thoughts in Markdown... Drag & Drop images/gifs/videos here to upload."
                      style={{
                        width: "100%", flex: 1, padding: 12, border: "1px solid var(--border-color)", borderRadius: 4,
                        background: "var(--bg-white)", color: "var(--text-primary)", outline: "none", resize: "none",
                        fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.5
                      }}
                    />
                  </div>
                )}

                {/* Right Pane: Live Preview */}
                {(previewMode === "preview" || previewMode === "split") && (
                  <div style={{
                    flex: 1, border: "1px solid var(--border-color)", borderRadius: 4, padding: 12,
                    background: "var(--bg-main)", overflowY: "auto", height: "100%"
                  }}>
                    <div className="markdown-preview" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {content.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      ) : (
                        <p style={{ color: "var(--text-light)", fontStyle: "italic" }}>Nothing to preview</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p style={{ fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4, padding: "8px 12px" }}>
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 16px", border: "1px solid var(--border-color)", borderRadius: 4,
                    background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px", background: "var(--accent)", color: "#fff",
                    border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
                  }}
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
