"use client";

import { useState } from "react";
import { adminApi, RouteEntry } from "@/lib/api";

type Props = {
  routes: RouteEntry[];
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (route: RouteEntry) => void;
  onDocs: (route: RouteEntry) => void;
};

const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  GET:    { bg: "#ebf8ff", color: "#2b6cb0" },
  POST:   { bg: "#f0fff4", color: "#276749" },
  PUT:    { bg: "#fffaf0", color: "#c05621" },
  PATCH:  { bg: "#faf5ff", color: "#6b46c1" },
  DELETE: { bg: "#fff5f5", color: "#c53030" },
};

// Group routes by project
function groupByProject(routes: RouteEntry[]): Record<string, RouteEntry[]> {
  return routes.reduce((acc, route) => {
    if (!acc[route.project]) acc[route.project] = [];
    acc[route.project].push(route);
    return acc;
  }, {} as Record<string, RouteEntry[]>);
}

export default function RegistryTable({ routes, onToggle, onDelete, onEdit, onDocs }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const grouped = groupByProject(routes);

  async function handleDelete(id: string) {
    if (!confirm("Delete this route and its documentation permanently?")) return;
    setDeletingId(id);
    try {
      await adminApi.deleteRoute(id);
      onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    const action = current ? "disable" : "enable";
    if (!confirm(`Are you sure you want to ${action} this API route?`)) return;
    await adminApi.toggleRoute(id, !current);
    onToggle(id, !current);
  }

  if (routes.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
        <p style={{ fontSize: "2rem", marginBottom: 12 }}>🔌</p>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
          No routes registered yet
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Routes are auto-discovered on backend startup, or add one manually
        </p>
      </div>
    );
  }

  const HEADERS = ["Method", "Path", "Module / Op", "Auth", "Source", "Status", "Actions"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {Object.entries(grouped).map(([project, projectRoutes]) => (
        <div key={project}>
          {/* Project header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 3,
              background: "rgba(74,144,217,0.08)", border: "1px solid rgba(74,144,217,0.2)",
              fontFamily: "Inconsolata, monospace", fontSize: "0.82rem",
              fontWeight: 700, color: "var(--accent)", letterSpacing: "0.04em",
            }}>
              /{project}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {projectRoutes.length} route{projectRoutes.length !== 1 ? "s" : ""}
            </span>
            {projectRoutes.some(r => r.stale) && (
              <span style={{
                padding: "2px 8px", borderRadius: 3, fontSize: "0.7rem", fontWeight: 700,
                background: "#fff8e1", color: "#b7791f", border: "1px solid #f6e05e",
                letterSpacing: "0.04em",
              }}>
                ⚠ STALE ROUTES
              </span>
            )}
          </div>

          {/* Routes table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", background: "var(--bg-main)" }}>
                  {HEADERS.map(h => (
                    <th key={h} style={{
                      padding: "10px 16px", textAlign: "left",
                      fontSize: "0.68rem", fontWeight: 700,
                      color: "var(--text-muted)", letterSpacing: "0.08em",
                      textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectRoutes.map((route, i) => {
                  const methodStyle = METHOD_COLORS[route.method] ?? { bg: "#f7fafc", color: "#4a5568" };
                  return (
                    <tr
                      key={route.id}
                      style={{
                        borderBottom: i < projectRoutes.length - 1 ? "1px solid var(--border-light)" : "none",
                        opacity: route.enabled ? 1 : 0.55,
                        transition: "opacity 0.2s",
                        background: route.stale ? "#fffdf0" : "transparent",
                      }}
                    >
                      {/* Method */}
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className={`method-badge method-${route.method}`}
                          style={{
                            padding: "2px 8px", borderRadius: 3,
                            background: methodStyle.bg, color: methodStyle.color,
                            fontFamily: "Inconsolata, monospace", fontSize: "0.76rem", fontWeight: 700,
                          }}
                        >
                          {route.method}
                        </span>
                      </td>

                      {/* Path */}
                      <td style={{ padding: "12px 16px" }}>
                        <code style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "Inconsolata, monospace" }}>
                          {route.fullPath}
                        </code>
                        {route.description && (
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                            {route.description}
                          </p>
                        )}
                        {route.stale && (
                          <p style={{ fontSize: "0.68rem", color: "#b7791f", marginTop: 2, fontWeight: 600 }}>
                            ⚠ No longer found in backend — review & delete if removed
                          </p>
                        )}
                      </td>

                      {/* Module / Op */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span className="tag">{route.module}</span>
                        {" / "}
                        <span className="tag">{route.operation}</span>
                      </td>

                      {/* Auth required */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "0.75rem", color: route.requiresAuth ? "var(--accent)" : "var(--text-light)" }}>
                          {route.requiresAuth ? "🔒 Yes" : "—"}
                        </span>
                      </td>

                      {/* Source: AUTO vs MANUAL */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "2px 7px", borderRadius: 3, fontSize: "0.68rem", fontWeight: 700,
                          letterSpacing: "0.06em",
                          background: route.autoRegistered ? "rgba(74,144,217,0.1)" : "#f0f0f0",
                          color: route.autoRegistered ? "var(--accent)" : "#718096",
                          border: `1px solid ${route.autoRegistered ? "rgba(74,144,217,0.25)" : "#e2e8f0"}`,
                        }}>
                          {route.autoRegistered ? "AUTO" : "MANUAL"}
                        </span>
                      </td>

                      {/* Toggle */}
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          id={`route-toggle-${route.id}`}
                          onClick={() => handleToggle(route.id, route.enabled)}
                          className={`route-status-toggle ${route.enabled ? "enabled" : "disabled"}`}
                          style={{
                            padding: "4px 12px", borderRadius: 12,
                            border: `1px solid ${route.enabled ? "#48bb78" : "#cbd5e0"}`,
                            background: route.enabled ? "#f0fff4" : "#f7fafc",
                            color: route.enabled ? "#276749" : "var(--text-muted)",
                            fontSize: "0.72rem", fontWeight: 700,
                            fontFamily: "Josefin Sans, sans-serif",
                            letterSpacing: "0.06em", cursor: "pointer",
                            transition: "all 0.18s",
                          }}
                        >
                          {route.enabled ? "● ON" : "○ OFF"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            id={`route-docs-${route.id}`}
                            onClick={() => onDocs(route)}
                            title="View / edit documentation"
                            style={{
                              padding: "4px 10px", border: "1px solid var(--border-color)",
                              borderRadius: 3, background: "transparent",
                              fontSize: "0.72rem", color: "var(--text-muted)",
                              cursor: "pointer", fontFamily: "Josefin Sans, sans-serif",
                              fontWeight: 600, transition: "all 0.18s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                          >
                            Docs
                          </button>
                          <button
                            id={`route-edit-${route.id}`}
                            onClick={() => onEdit(route)}
                            style={{
                              padding: "4px 10px", border: "1px solid var(--border-color)",
                              borderRadius: 3, background: "transparent",
                              fontSize: "0.72rem", color: "var(--text-muted)",
                              cursor: "pointer", fontFamily: "Josefin Sans, sans-serif",
                              fontWeight: 600, transition: "all 0.18s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                          >
                            Edit
                          </button>
                          <button
                            id={`route-delete-${route.id}`}
                            onClick={() => handleDelete(route.id)}
                            disabled={deletingId === route.id}
                            style={{
                              padding: "4px 10px", border: "1px solid var(--border-color)",
                              borderRadius: 3, background: "transparent",
                              fontSize: "0.72rem", color: "var(--text-muted)",
                              cursor: "pointer", fontFamily: "Josefin Sans, sans-serif",
                              fontWeight: 600, transition: "all 0.18s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e53e3e"; e.currentTarget.style.color = "#e53e3e"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                          >
                            {deletingId === route.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
