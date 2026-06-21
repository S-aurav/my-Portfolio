"use client";

import { useState, useEffect } from "react";
import { adminApi, RouteEntry, RouteFormData } from "@/lib/api";

type Props = {
  route?: RouteEntry | null;          // null = create mode
  onSave: (route: RouteEntry) => void;
  onClose: () => void;
};

const EMPTY_FORM: RouteFormData = {
  project: "",
  module: "",
  operation: "",
  fullPath: "",
  method: "GET",
  description: "",
  tags: "",
  enabled: true,
  requiresAuth: false,
};

export default function RouteFormModal({ route, onSave, onClose }: Props) {
  const [form, setForm] = useState<RouteFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!route;

  useEffect(() => {
    if (route) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, autoRegistered, stale, ...rest } = route;
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [route]);

  // Auto-build fullPath from project/module/operation
  useEffect(() => {
    if (form.project && form.module && form.operation) {
      setForm(f => ({
        ...f,
        fullPath: `/api/${f.project}/${f.module}/${f.operation}`,
      }));
    }
  }, [form.project, form.module, form.operation]);

  function set(key: keyof RouteFormData, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = isEdit
        ? await adminApi.updateRoute(route!.id, form)
        : await adminApi.createRoute(form);
      onSave(result.data as RouteEntry);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px",
    border: "1px solid var(--border-color)", borderRadius: 4,
    fontSize: "0.85rem", color: "var(--text-primary)",
    background: "#fff", outline: "none", fontFamily: "Inconsolata, monospace",
    transition: "border-color 0.18s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.7rem", fontWeight: 700,
    color: "var(--text-muted)", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: 5,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.35)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: "100%", maxWidth: 560, padding: "32px 32px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {isEdit ? "Edit Route" : "Add New Route"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem" }}>
            ✕
          </button>
        </div>

        {isEdit && route?.autoRegistered && (
          <div style={{
            padding: "8px 12px", borderRadius: 4, marginBottom: 16,
            background: "rgba(74,144,217,0.07)", border: "1px solid rgba(74,144,217,0.2)",
            fontSize: "0.78rem", color: "var(--accent)",
          }}>
            🤖 This route was auto-discovered by the backend scanner.
            Editing will clear the stale flag if set.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Row 1: project / module / operation */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Project</label>
              <input style={inputStyle} value={form.project} onChange={e => set("project", e.target.value)} placeholder="hq" required />
            </div>
            <div>
              <label style={labelStyle}>Module</label>
              <input style={inputStyle} value={form.module} onChange={e => set("module", e.target.value)} placeholder="notes" required />
            </div>
            <div>
              <label style={labelStyle}>Operation</label>
              <input style={inputStyle} value={form.operation} onChange={e => set("operation", e.target.value)} placeholder="create" required />
            </div>
          </div>

          {/* Full path (auto-generated, editable) */}
          <div>
            <label style={labelStyle}>Full Path (auto-generated)</label>
            <input style={{ ...inputStyle, background: "#f7fafc" }} value={form.fullPath} onChange={e => set("fullPath", e.target.value)} placeholder="/api/hq/notes/create" required />
          </div>

          {/* Row 2: method */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>HTTP Method</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.method} onChange={e => set("method", e.target.value)}>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input style={inputStyle} value={form.tags ?? ""} onChange={e => set("tags", e.target.value)} placeholder="read-only, public, auth" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description (optional)</label>
            <input style={inputStyle} value={form.description ?? ""} onChange={e => set("description", e.target.value)} placeholder="What does this endpoint do?" />
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { key: "enabled" as const, label: "Enabled" },
              { key: "requiresAuth" as const, label: "Requires Auth" },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => set(key, e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: "var(--accent)", cursor: "pointer" }}
                />
                {label}
              </label>
            ))}
          </div>

          {error && (
            <p style={{ fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4, padding: "8px 12px" }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: "9px 20px", border: "1px solid var(--border-color)", borderRadius: 4,
              background: "transparent", fontSize: "0.8rem", color: "var(--text-muted)",
              cursor: "pointer", fontFamily: "Josefin Sans, sans-serif", fontWeight: 600,
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              padding: "9px 20px", border: "none", borderRadius: 4,
              background: loading ? "var(--text-muted)" : "var(--accent)",
              color: "#fff", fontSize: "0.8rem", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Josefin Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em",
            }}>
              {loading ? "Saving…" : isEdit ? "Update Route" : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
