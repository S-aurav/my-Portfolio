"use client";

import { useState, useEffect } from "react";
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
    label: "Profile",
    href: "/admin/profile",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: (
      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const active = document.documentElement.getAttribute("data-theme") as "light" | "dark" || "light";
    setTheme(active);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Swipe gesture listeners to open/close sidebar on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && touchStartX <= 40) {
          setIsOpen(true);
        } else if (diffX < 0 && isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="site-container">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle-btn"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          onTouchMove={() => setIsOpen(false)}
          onWheel={() => setIsOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} style={{ paddingTop: 32 }}>
        {/* Brand */}
        <div style={{ width: "100%", marginBottom: 32 }}>
          <Link href="/" onClick={handleLinkClick} style={{ textDecoration: "none" }}>
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
                  onClick={handleLinkClick}
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
            Coming in Phase 2+
          </p>
          {["Blog", "File Library"].map(item => (
            <p key={item} style={{ fontSize: "0.8rem", color: "var(--text-light)", padding: "6px 12px", fontFamily: "Josefin Sans, sans-serif" }}>
              {item} <span style={{ fontSize: "0.65rem" }}>— soon</span>
            </p>
          ))}
        </div>

        {/* Logout & Theme Switcher */}
        <div style={{ marginTop: "auto", paddingTop: 24, width: "100%", display: "flex", gap: 10, alignItems: "center" }}>
          <button
            id="admin-logout-btn"
            onClick={logout}
            style={{
              flex: 1, padding: "8px 12px",
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

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{
              width: 36, height: 36, borderRadius: 4,
              border: "1px solid var(--border-color)",
              background: "transparent", color: "var(--text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, transition: "all 0.18s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {theme === "dark" ? (
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
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
