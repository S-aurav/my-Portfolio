"use client";

import { useEffect, useState } from "react";
import { adminApi, SkillEntry, SkillFormData } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", border: "1px solid var(--border-color)",
  background: "#fff", color: "var(--text-primary)", outline: "none",
  fontSize: "0.85rem", fontFamily: "inherit", borderRadius: 0,
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SkillEntry | null>(null);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSkills(); }, []);

  async function fetchSkills() {
    setLoading(true);
    try {
      const res = await adminApi.getAllSkills();
      setSkills(res.data || []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null); setCategory(""); setName(""); setDisplayOrder(skills.length);
    setError(""); setModalOpen(true);
  }
  function openEdit(s: SkillEntry) {
    setEditing(s); setCategory(s.category); setName(s.name); setDisplayOrder(s.displayOrder);
    setError(""); setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const body: SkillFormData = { category: category.trim(), name: name.trim(), displayOrder };
    try {
      if (editing) await adminApi.updateSkill(editing.id, body);
      else await adminApi.createSkill(body);
      setModalOpen(false);
      fetchSkills();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    try { await adminApi.deleteSkill(id); fetchSkills(); }
    catch (e: any) { setError(e.message); }
  }

  async function handleMoveSkill(skill: SkillEntry, direction: "up" | "down") {
    // Find all skills in the same category and sort them by current displayOrder
    const catSkills = skills
      .filter(s => s.category === skill.category)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const index = catSkills.findIndex(s => s.id === skill.id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= catSkills.length) return;

    const targetSkill = catSkills[newIndex];

    // Re-create the list with swapped items
    const newOrder = [...catSkills];
    newOrder[index] = targetSkill;
    newOrder[newIndex] = skill;

    setSaving(true);
    try {
      // Save displayOrder as the sequential index in the new list
      for (let i = 0; i < newOrder.length; i++) {
        const item = newOrder[i];
        if (item.displayOrder !== i) {
          await adminApi.updateSkill(item.id, {
            category: item.category,
            name: item.name,
            displayOrder: i
          });
        }
      }
      await fetchSkills();
    } catch (e: any) {
      alert("Failed to update skill order: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  // Group skills by category for display
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, SkillEntry[]>);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Skills</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <button onClick={openCreate} style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 0 }}>
          + Add Skill
        </button>
      </div>

      {error && <p style={{ marginBottom: 16, fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", padding: "8px 12px" }}>{error}</p>}

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No skills yet. Add your first skill!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat} className="card" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontFamily: "Josefin Sans, sans-serif" }}>{cat}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {catSkills.sort((a, b) => a.displayOrder - b.displayOrder).map((s, idx, arr) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--tag-bg)", border: "1px solid var(--border-color)", padding: "4px 10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", marginRight: 2 }}>
                      <button
                        type="button"
                        onClick={() => handleMoveSkill(s, "up")}
                        disabled={idx === 0 || saving}
                        style={{ background: "none", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", color: idx === 0 ? "var(--text-light-gray, #ccc)" : "var(--accent)", fontSize: "0.55rem", padding: 0, lineHeight: 1 }}
                        title="Move Up"
                      >▲</button>
                      <button
                        type="button"
                        onClick={() => handleMoveSkill(s, "down")}
                        disabled={idx === arr.length - 1 || saving}
                        style={{ background: "none", border: "none", cursor: idx === arr.length - 1 ? "not-allowed" : "pointer", color: idx === arr.length - 1 ? "var(--text-light-gray, #ccc)" : "var(--accent)", fontSize: "0.55rem", padding: 0, lineHeight: 1 }}
                        title="Move Down"
                      >▼</button>
                    </div>
                    <span style={{ fontFamily: "Inconsolata, monospace", fontSize: "0.8rem", color: "var(--tag-color)" }}>{s.name}</span>
                    <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "0.7rem", padding: "0 2px", lineHeight: 1 }} title="Edit">✎</button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53e3e", fontSize: "0.7rem", padding: "0 2px", lineHeight: 1 }} title="Delete">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="card" style={{ width: 420, padding: "28px 28px 20px", position: "relative" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Skill" : "Add Skill"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)} required style={inputStyle} placeholder="e.g. Backend, Languages, Cloud" list="category-suggestions" />
                <datalist id="category-suggestions">
                  {[...new Set(skills.map(s => s.category))].map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Skill Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="e.g. Spring Boot" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Display Order</label>
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))} style={inputStyle} />
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
