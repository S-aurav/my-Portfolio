"use client";

import { useEffect, useState } from "react";
import { adminApi, ExperienceEntry, ExperienceFormData } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", border: "1px solid var(--border-color)",
  background: "#fff", color: "var(--text-primary)", outline: "none",
  fontSize: "0.85rem", fontFamily: "inherit", borderRadius: 0,
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", fontWeight: 700,
  color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
};

function safeParseArray(json: string | null | undefined): string[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export default function AdminExperience() {
  const [items, setItems] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceEntry | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState<"work" | "education">("work");
  const [location, setLocation] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [techStack, setTechStack] = useState<string[]>([""]);
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => { fetchExperience(); }, []);

  async function fetchExperience() {
    setLoading(true);
    try {
      const res = await adminApi.getAllExperience();
      // Sort experience entries by displayOrder ascending
      const sorted = (res.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
      setItems(sorted);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  function resetForm() {
    setRole(""); setCompany(""); setDuration(""); setType("work");
    setLocation(""); setHighlights([""]); setTechStack([""]); setDisplayOrder(items.length);
  }

  function openCreate() {
    setEditing(null); resetForm(); setError(""); setModalOpen(true);
  }

  function openEdit(item: ExperienceEntry) {
    setEditing(item);
    setRole(item.role); setCompany(item.company); setDuration(item.duration);
    setType(item.type as "work" | "education"); setLocation(item.location);
    const h = safeParseArray(item.highlights);
    const t = safeParseArray(item.techStack);
    setHighlights(h.length ? h : [""]);
    setTechStack(t.length ? t : [""]);
    setDisplayOrder(item.displayOrder);
    setError(""); setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const body: ExperienceFormData = {
      role: role.trim(), company: company.trim(), duration: duration.trim(),
      type, location: location.trim(), displayOrder,
      highlights: JSON.stringify(highlights.filter(h => h.trim())),
      techStack: JSON.stringify(techStack.filter(t => t.trim())),
    };
    try {
      if (editing) await adminApi.updateExperience(editing.id, body);
      else await adminApi.createExperience(body);
      setModalOpen(false); fetchExperience();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience entry?")) return;
    try { await adminApi.deleteExperience(id); fetchExperience(); }
    catch (e: any) { setError(e.message); }
  }

  async function handleMoveExperience(item: ExperienceEntry, direction: "up" | "down") {
    const index = items.findIndex(x => x.id === item.id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const targetItem = items[newIndex];

    const newOrder = [...items];
    newOrder[index] = targetItem;
    newOrder[newIndex] = item;

    setSaving(true);
    try {
      // Re-assign displayOrder values as sequential indices
      for (let i = 0; i < newOrder.length; i++) {
        const x = newOrder[i];
        if (x.displayOrder !== i) {
          await adminApi.updateExperience(x.id, {
            role: x.role,
            company: x.company,
            duration: x.duration,
            type: x.type,
            location: x.location,
            displayOrder: i,
            highlights: x.highlights,
            techStack: x.techStack
          });
        }
      }
      await fetchExperience();
    } catch (e: any) {
      alert("Failed to swap order: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  const typeColors: Record<string, string> = { work: "var(--accent)", education: "#805ad5" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Experience</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Work &amp; education timeline</p>
        </div>
        <button onClick={openCreate} style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 0 }}>
          + Add Entry
        </button>
      </div>

      {error && <p style={{ marginBottom: 16, fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", padding: "8px 12px" }}>{error}</p>}

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No entries yet. Add your first experience!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, index) => {
            const highlights = safeParseArray(item.highlights);
            const tech = safeParseArray(item.techStack);
            return (
              <div key={item.id} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {/* Re-order arrows */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(item, "up")}
                      disabled={index === 0 || saving}
                      style={{ background: "none", border: "none", cursor: index === 0 ? "not-allowed" : "pointer", color: index === 0 ? "var(--text-light-gray, #ccc)" : "var(--accent)", fontSize: "0.85rem", padding: 4, lineHeight: 1 }}
                      title="Move Up"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(item, "down")}
                      disabled={index === items.length - 1 || saving}
                      style={{ background: "none", border: "none", cursor: index === items.length - 1 ? "not-allowed" : "pointer", color: index === items.length - 1 ? "var(--text-light-gray, #ccc)" : "var(--accent)", fontSize: "0.85rem", padding: 4, lineHeight: 1 }}
                      title="Move Down"
                    >▼</button>
                  </div>

                  {/* Main Details */}
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{item.role}</span>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "1px 7px", border: `1px solid ${typeColors[item.type] ?? "var(--border-color)"}`, color: typeColors[item.type] ?? "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.type}</span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600, marginBottom: 2 }}>{item.company}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "Inconsolata, monospace" }}>{item.duration} · {item.location}</p>
                      {highlights.length > 0 && (
                        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: 6 }}>{highlights.length} highlight{highlights.length !== 1 ? "s" : ""}{tech.length > 0 ? ` · ${tech.join(", ")}` : ""}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => openEdit(item)} style={{ padding: "5px 12px", border: "1px solid var(--border-color)", background: "transparent", cursor: "pointer", fontSize: "0.75rem", fontFamily: "Josefin Sans, sans-serif", fontWeight: 600, borderRadius: 0 }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 12px", border: "1px solid #fed7d7", background: "#fff5f5", color: "#e53e3e", cursor: "pointer", fontSize: "0.75rem", fontFamily: "Josefin Sans, sans-serif", fontWeight: 600, borderRadius: 0 }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, overflowY: "auto", padding: "24px 0" }}>
          <div className="card" style={{ width: 560, maxHeight: "90vh", overflowY: "auto", padding: "28px 28px 20px", position: "relative" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Entry" : "New Entry"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Role / Degree</label>
                  <input value={role} onChange={e => setRole(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company / Institution</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <input value={duration} onChange={e => setDuration(e.target.value)} required style={inputStyle} placeholder="Jan 2024 – Present" />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={type} onChange={e => setType(e.target.value as "work" | "education")} style={{ ...inputStyle }}>
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Highlights</label>
                <ArrayField values={highlights} setValues={setHighlights} placeholder="What you accomplished..." />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Tech Stack (optional)</label>
                <ArrayField values={techStack} setValues={setTechStack} placeholder="e.g. Java, Spring Boot" />
              </div>

              {error && <p style={{ marginBottom: 12, fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", padding: "8px 12px" }}>{error}</p>}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: "8px 18px", border: "1px solid var(--border-color)", background: "transparent", cursor: "pointer", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.78rem", fontWeight: 600, borderRadius: 0 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.78rem", fontWeight: 700, opacity: saving ? 0.7 : 1, borderRadius: 0 }}>{saving ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrayField({ values, setValues, placeholder }: { values: string[]; setValues: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      {values.map((v, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input value={v} onChange={e => { const n = [...values]; n[i] = e.target.value; setValues(n); }} style={{ ...inputStyle, flex: 1 }} placeholder={placeholder} />
          <button type="button" onClick={() => setValues(values.filter((_, j) => j !== i))} style={{ padding: "0 10px", border: "1px solid #fed7d7", background: "#fff5f5", color: "#e53e3e", cursor: "pointer", borderRadius: 0, fontSize: "0.9rem" }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={() => setValues([...values, ""])} style={{ fontSize: "0.75rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>+ Add</button>
    </div>
  );
}
