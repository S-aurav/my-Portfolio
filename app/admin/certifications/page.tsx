"use client";

import { useEffect, useState } from "react";
import { adminApi, CertificationEntry, CertificationFormData } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", border: "1px solid var(--border-color)",
  background: "var(--bg-white)", color: "var(--text-primary)", outline: "none",
  fontSize: "0.85rem", fontFamily: "inherit", borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", fontWeight: 700,
  color: "var(--text-muted)", letterSpacing: "0.08em",
  textTransform: "uppercase", marginBottom: 6,
};

export default function AdminCertifications() {
  const [certs, setCerts] = useState<CertificationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CertificationEntry | null>(null);

  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCerts(); }, []);

  async function fetchCerts() {
    setLoading(true);
    try {
      const res = await adminApi.getAllCertifications();
      setCerts((res.data || []).sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null);
    setName("");
    setDisplayOrder(certs.length);
    setError("");
    setModalOpen(true);
  }

  function openEdit(c: CertificationEntry) {
    setEditing(c);
    setName(c.name);
    setDisplayOrder(c.displayOrder);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const body: CertificationFormData = { name: name.trim(), displayOrder };
    try {
      if (editing) await adminApi.updateCertification(editing.id, body);
      else await adminApi.createCertification(body);
      setModalOpen(false);
      fetchCerts();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certification?")) return;
    try { await adminApi.deleteCertification(id); fetchCerts(); }
    catch (e: any) { setError(e.message); }
  }

  async function handleMove(cert: CertificationEntry, direction: "up" | "down") {
    const sorted = [...certs].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex(c => c.id === cert.id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sorted.length) return;

    const reordered = [...sorted];
    const temp = reordered[idx];
    reordered[idx] = reordered[newIdx];
    reordered[newIdx] = temp;

    setSaving(true);
    try {
      for (let i = 0; i < reordered.length; i++) {
        const item = reordered[i];
        if (item.displayOrder !== i) {
          await adminApi.updateCertification(item.id, { name: item.name, displayOrder: i });
        }
      }
      await fetchCerts();
    } catch (e: any) { setError("Failed to reorder: " + e.message); }
    finally { setSaving(false); }
  }

  const sorted = [...certs].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Certifications</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{certs.length} certification{certs.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 0 }}
        >
          + Add Certification
        </button>
      </div>

      {error && (
        <p style={{ marginBottom: 16, fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", padding: "8px 12px" }}>{error}</p>
      )}

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No certifications yet. Add your first one!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sorted.map((cert, idx, arr) => (
              <div
                key={cert.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--border-color)", background: "var(--bg-main)" }}
              >
                {/* Reorder arrows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button
                    type="button"
                    onClick={() => handleMove(cert, "up")}
                    disabled={idx === 0 || saving}
                    style={{ background: "none", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", color: idx === 0 ? "var(--text-light)" : "var(--accent)", fontSize: "0.55rem", padding: 0, lineHeight: 1 }}
                    title="Move Up"
                  >▲</button>
                  <button
                    type="button"
                    onClick={() => handleMove(cert, "down")}
                    disabled={idx === arr.length - 1 || saving}
                    style={{ background: "none", border: "none", cursor: idx === arr.length - 1 ? "not-allowed" : "pointer", color: idx === arr.length - 1 ? "var(--text-light)" : "var(--accent)", fontSize: "0.55rem", padding: 0, lineHeight: 1 }}
                    title="Move Down"
                  >▼</button>
                </div>

                {/* Bullet */}
                <span style={{ color: "var(--accent)", fontSize: "0.8rem", flexShrink: 0 }}>▸</span>

                {/* Name */}
                <span style={{ flex: 1, fontFamily: "Josefin Sans, sans-serif", fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 600 }}>
                  {cert.name}
                </span>

                {/* Actions */}
                <button
                  onClick={() => openEdit(cert)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "0.78rem", padding: "0 4px" }}
                  title="Edit"
                >✎</button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#e53e3e", fontSize: "0.78rem", padding: "0 4px" }}
                  title="Delete"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="card" style={{ width: 420, padding: "28px 28px 20px", position: "relative" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>
              {editing ? "Edit Certification" : "Add Certification"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Certification Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={e => setDisplayOrder(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              {error && (
                <p style={{ marginBottom: 12, fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", padding: "8px 12px" }}>{error}</p>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: "8px 18px", border: "1px solid var(--border-color)", background: "transparent", cursor: "pointer", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.78rem", fontWeight: 600, borderRadius: 0 }}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.78rem", fontWeight: 700, opacity: saving ? 0.7 : 1, borderRadius: 0 }}
                >{saving ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
