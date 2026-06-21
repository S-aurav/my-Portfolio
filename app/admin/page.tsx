"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, RouteEntry } from "@/lib/api";

export default function AdminDashboard() {
  const [routes, setRoutes] = useState<RouteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllRoutes()
      .then(res => setRoutes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = routes.length;
  const enabled = routes.filter(r => r.enabled).length;
  const disabled = total - enabled;
  const projects = [...new Set(routes.map(r => r.project))];

  const stats = [
    { label: "Total Routes", value: loading ? "—" : total, color: "var(--accent)" },
    { label: "Enabled", value: loading ? "—" : enabled, color: "#48bb78" },
    { label: "Disabled", value: loading ? "—" : disabled, color: "#e53e3e" },
    { label: "Projects", value: loading ? "—" : projects.length, color: "#805ad5" },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Overview of your HQ backend platform
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {stats.map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2rem", fontWeight: 800, color: stat.color, marginBottom: 4 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Projects breakdown */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          Projects
        </h2>
        <p className="section-subtitle">API breakdown by project</p>

        {loading ? (
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading…</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No routes registered yet. Go to <Link href="/admin/registry" style={{ color: "var(--accent)" }}>API Registry</Link> to add your first route.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.map(project => {
              const projectRoutes = routes.filter(r => r.project === project);
              const projectEnabled = projectRoutes.filter(r => r.enabled).length;
              const pct = Math.round((projectEnabled / projectRoutes.length) * 100);
              return (
                <div key={project} className="card" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <code style={{ fontFamily: "Inconsolata, monospace", fontSize: "0.9rem", fontWeight: 700, color: "var(--accent)" }}>
                        /{project}
                      </code>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {projectRoutes.length} routes · {projectEnabled} enabled
                      </span>
                    </div>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: pct === 100 ? "#48bb78" : pct > 0 ? "var(--accent)" : "#e53e3e" }}>
                      {pct}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 4, background: "var(--border-light)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#48bb78" : "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          Quick Access
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/admin/registry" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", border: "1px solid var(--accent)", borderRadius: 4,
            color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif",
            fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em",
            textDecoration: "none", transition: "all 0.18s",
          }}>
            → API Registry
          </Link>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", border: "1px solid var(--border-color)", borderRadius: 4,
            color: "var(--text-muted)", fontFamily: "Josefin Sans, sans-serif",
            fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em",
            textDecoration: "none", transition: "all 0.18s",
          }}>
            ← Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
