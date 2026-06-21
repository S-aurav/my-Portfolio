"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

const navLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: "Notes",
    href: "/admin/notes",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "API Registry",
    href: "/admin/registry",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="site-container">
      {/* Admin Sidebar */}
      <aside className="sidebar" style={{ paddingTop: 32 }}>
        {/* Brand */}
        <div style={{ width: "100%", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              ← Back to site
            </p>
          </Link>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            HQ Admin
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
            Control Panel
          </p>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <ul className="sidebar-nav w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 4,
                    fontFamily: "Josefin Sans, sans-serif",
                    fontSize: "0.83rem", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive ? "rgba(74,144,217,0.07)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.18s",
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-divider" />

        {/* Coming soon modules */}
        <div style={{ width: "100%", marginBottom: 16 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Coming in Phase 3+
          </p>
          {["Blog", "Files"].map(item => (
            <p key={item} style={{ fontSize: "0.8rem", color: "var(--text-light)", padding: "6px 12px", fontFamily: "Josefin Sans, sans-serif" }}>
              {item} <span style={{ fontSize: "0.65rem" }}>— soon</span>
            </p>
          ))}
        </div>

        {/* Logout */}
        <div style={{ marginTop: "auto", paddingTop: 24, width: "100%" }}>
          <button
            id="admin-logout-btn"
            onClick={logout}
            style={{
              width: "100%", padding: "8px 12px",
              border: "1px solid var(--border-color)",
              borderRadius: 4, background: "transparent",
              fontFamily: "Josefin Sans, sans-serif",
              fontSize: "0.78rem", fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--text-muted)", cursor: "pointer",
              transition: "all 0.18s",
              display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#e53e3e";
              e.currentTarget.style.color = "#e53e3e";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ padding: "40px 48px" }}>
        {children}
      </main>
    </div>
  );
}
