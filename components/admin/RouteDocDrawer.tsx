"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi, RouteEntry, RouteDoc, RouteDocData } from "@/lib/api";

type Props = {
  route: RouteEntry | null;   // null = drawer closed
  onClose: () => void;
};

const EMPTY_DOC: RouteDocData = {
  requestBody: "",
  responseBody: "",
  pathVariables: "",
  queryParams: "",
  requestHeaders: "",
  exampleRequest: "",
  exampleResponse: "",
  notes: "",
};

const FIELDS: { key: keyof RouteDocData; label: string; hint: string; rows: number }[] = [
  {
    key: "requestBody",
    label: "Request Body",
    hint: "Describe the JSON fields, types, and whether they're required. Plain text or JSON Schema.",
    rows: 4,
  },
  {
    key: "responseBody",
    label: "Response Body",
    hint: "Describe the response JSON structure and fields.",
    rows: 4,
  },
  {
    key: "pathVariables",
    label: "Path Variables",
    hint: 'e.g.\n{id} — The UUID of the resource',
    rows: 3,
  },
  {
    key: "queryParams",
    label: "Query Parameters",
    hint: 'e.g.\npage (int, default 0) — Page number\nsize (int, default 20) — Page size',
    rows: 3,
  },
  {
    key: "requestHeaders",
    label: "Request Headers",
    hint: 'e.g.\nAuthorization: Bearer <token>\nContent-Type: application/json',
    rows: 3,
  },
  {
    key: "exampleRequest",
    label: "Example Request",
    hint: "Paste an example cURL command or raw JSON body.",
    rows: 5,
  },
  {
    key: "exampleResponse",
    label: "Example Response",
    hint: "Paste an example JSON response payload.",
    rows: 5,
  },
  {
    key: "notes",
    label: "Notes",
    hint: "Admin notes, caveats, rate limits, deprecation warnings, etc.",
    rows: 3,
  },
];

export default function RouteDocDrawer({ route, onClose }: Props) {
  const [doc, setDoc] = useState<RouteDocData>(EMPTY_DOC);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadDocs = useCallback(async (routeId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getDocs(routeId);
      const d = res.data as RouteDoc;
      setDoc({
        requestBody: d.requestBody ?? "",
        responseBody: d.responseBody ?? "",
        pathVariables: d.pathVariables ?? "",
        queryParams: d.queryParams ?? "",
        requestHeaders: d.requestHeaders ?? "",
        exampleRequest: d.exampleRequest ?? "",
        exampleResponse: d.exampleResponse ?? "",
        notes: d.notes ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load docs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (route) {
      setDoc(EMPTY_DOC);
      setSaved(false);
      setError("");
      loadDocs(route.id);
    }
  }, [route, loadDocs]);

  function set(key: keyof RouteDocData, value: string) {
    setDoc(d => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    if (!route) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.saveDocs(route.id, doc);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const isOpen = !!route;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 900,
          background: "rgba(0,0,0,0.25)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000,
        width: "min(620px, 100vw)",
        background: "#fff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{
                padding: "2px 8px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700,
                background: route?.autoRegistered ? "rgba(74,144,217,0.1)" : "#f0f0f0",
                color: route?.autoRegistered ? "var(--accent)" : "#718096",
                border: `1px solid ${route?.autoRegistered ? "rgba(74,144,217,0.25)" : "#e2e8f0"}`,
              }}>
                {route?.autoRegistered ? "AUTO" : "MANUAL"}
              </span>
              {route?.stale && (
                <span style={{
                  padding: "2px 7px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700,
                  background: "#fff8e1", color: "#b7791f", border: "1px solid #f6e05e",
                }}>
                  ⚠ STALE
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              API Documentation
            </h2>
            {route && (
              <code style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "Inconsolata, monospace" }}>
                [{route.method}] {route.fullPath}
              </code>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.3rem", padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Loading docs…
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {FIELDS.map(({ key, label, hint, rows }) => (
                <div key={key}>
                  <label style={{
                    display: "block", fontSize: "0.7rem", fontWeight: 700,
                    color: "var(--text-muted)", letterSpacing: "0.08em",
                    textTransform: "uppercase", marginBottom: 4,
                  }}>
                    {label}
                  </label>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-light)", marginBottom: 6, fontStyle: "italic" }}>
                    {hint.split("\n")[0]}
                  </p>
                  <textarea
                    id={`doc-${key}`}
                    value={doc[key] ?? ""}
                    onChange={e => set(key, e.target.value)}
                    rows={rows}
                    placeholder={hint}
                    style={{
                      width: "100%", padding: "8px 10px",
                      border: "1px solid var(--border-color)", borderRadius: 4,
                      fontSize: "0.82rem", color: "var(--text-primary)",
                      background: "#fafbfc", outline: "none",
                      fontFamily: "Inconsolata, monospace",
                      resize: "vertical", lineHeight: 1.5,
                      transition: "border-color 0.18s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-color)")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 28px", borderTop: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", bottom: 0, background: "#fff",
        }}>
          <div>
            {error && <p style={{ fontSize: "0.78rem", color: "#e53e3e", margin: 0 }}>{error}</p>}
            {saved && !error && (
              <p style={{ fontSize: "0.78rem", color: "#276749", margin: 0 }}>✓ Docs saved successfully</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 18px", border: "1px solid var(--border-color)", borderRadius: 4,
                background: "transparent", fontSize: "0.8rem", color: "var(--text-muted)",
                cursor: "pointer", fontFamily: "Josefin Sans, sans-serif", fontWeight: 600,
              }}
            >
              Close
            </button>
            <button
              id="save-docs-btn"
              onClick={handleSave}
              disabled={saving || loading}
              style={{
                padding: "8px 20px", border: "none", borderRadius: 4,
                background: saving ? "var(--text-muted)" : "var(--accent)",
                color: "#fff", fontSize: "0.8rem",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "Josefin Sans, sans-serif", fontWeight: 700, letterSpacing: "0.06em",
              }}
            >
              {saving ? "Saving…" : "Save Docs"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
