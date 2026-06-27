"use client";

import { useEffect, useState } from "react";
import { adminApi, RouteEntry } from "@/lib/api";
import RegistryTable from "@/components/admin/RegistryTable";
import RouteFormModal from "@/components/admin/RouteFormModal";
import RouteDocDrawer from "@/components/admin/RouteDocDrawer";

export default function RegistryPage() {
  const [routes, setRoutes] = useState<RouteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteEntry | null>(null);
  const [docsRoute, setDocsRoute] = useState<RouteEntry | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchRoutes(); }, []);

  async function fetchRoutes() {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getAllRoutes();
      setRoutes(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load routes");
    } finally {
      setLoading(false);
    }
  }

  function handleSave(saved: RouteEntry) {
    setRoutes(prev => {
      const idx = prev.findIndex(r => r.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
  }

  function handleToggle(id: string, enabled: boolean) {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, enabled } : r));
  }

  function handleDelete(id: string) {
    setRoutes(prev => prev.filter(r => r.id !== id));
  }

  function handleEdit(route: RouteEntry) {
    setEditingRoute(route);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingRoute(null);
  }

  function handleDocs(route: RouteEntry) {
    setDocsRoute(route);
  }

  function handleCloseDocs() {
    setDocsRoute(null);
  }

  const filtered = search
    ? routes.filter(r =>
        r.fullPath.toLowerCase().includes(search.toLowerCase()) ||
        r.project.toLowerCase().includes(search.toLowerCase()) ||
        r.module.toLowerCase().includes(search.toLowerCase()) ||
        r.method.includes(search.toUpperCase()) ||
        (r.tags ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : routes;

  const enabledCount = routes.filter(r => r.enabled).length;
  const staleCount = routes.filter(r => r.stale).length;
  const autoCount = routes.filter(r => r.autoRegistered).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            API Registry
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {loading ? "Loading…" : `${routes.length} routes · ${enabledCount} enabled · ${autoCount} auto-discovered`}
          </p>
        </div>
        <button
          id="registry-add-btn"
          onClick={() => { setEditingRoute(null); setShowModal(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", border: "none", borderRadius: 4,
            background: "var(--accent)", color: "#fff",
            fontFamily: "Josefin Sans, sans-serif", fontSize: "0.8rem",
            fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
        >
          + Add Route
        </button>
      </div>

      {/* Stale routes banner */}
      {staleCount > 0 && (
        <div style={{
          marginBottom: 16, padding: "10px 16px",
          background: "#fff8e1", border: "1px solid #f6e05e", borderRadius: 4,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span>⚠</span>
          <p style={{ fontSize: "0.83rem", color: "#744210", margin: 0 }}>
            <strong>{staleCount} stale route{staleCount > 1 ? "s" : ""}</strong> — previously auto-discovered but no longer found in the backend.
            Review and delete routes that have been removed from the codebase.
          </p>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          id="registry-search"
          type="text"
          placeholder="Search by path, project, module, method or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 480, padding: "9px 14px",
            border: "1px solid var(--border-color)", borderRadius: 4,
            fontSize: "0.85rem", color: "var(--text-primary)",
            background: "var(--bg-white)", outline: "none",
            fontFamily: "Inconsolata, monospace",
            transition: "border-color 0.18s",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--accent)")}
          onBlur={e => (e.target.style.borderColor = "var(--border-color)")}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 16, padding: "10px 16px", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4 }}>
          <p style={{ fontSize: "0.85rem", color: "#e53e3e" }}>{error}</p>
          <button onClick={fetchRoutes} style={{ marginTop: 6, fontSize: "0.78rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading routes…</p>
        </div>
      ) : (
        <RegistryTable
          routes={filtered}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDocs={handleDocs}
        />
      )}

      {/* Edit / Create Modal */}
      {showModal && (
        <RouteFormModal
          route={editingRoute}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {/* Docs Drawer — always rendered, slides in/out */}
      <RouteDocDrawer
        route={docsRoute}
        onClose={handleCloseDocs}
      />
    </div>
  );
}
