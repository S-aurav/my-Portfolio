"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NoteEntry, NotesPageConfig, defaultNotesPageConfig } from "@/lib/api";
import CornerArt from "./CornerArt";
import NotesList from "./NotesList";
import NoteReader from "./NoteReader";

interface NotesPageLayoutProps {
  notes: NoteEntry[];
  config: NotesPageConfig | null;
}

// Theme → CSS variable overrides
const THEME_COLORS: Record<string, { accent: string; accentMuted: string; heroBg: string }> = {
  sky:     { accent: "#5aa8d5", accentMuted: "rgba(90,168,213,0.12)", heroBg: "linear-gradient(135deg, #102a43 0%, #244e66 100%)" },
  floral:  { accent: "#b97ab3", accentMuted: "rgba(185,122,179,0.12)", heroBg: "linear-gradient(135deg, #3b1d38 0%, #5c2b53 100%)" },
  forest:  { accent: "#5a9e72", accentMuted: "rgba(90,158,114,0.12)", heroBg: "linear-gradient(135deg, #14321a 0%, #234e2f 100%)" },
  neutral: { accent: "#8a8a8a", accentMuted: "rgba(138,138,138,0.10)", heroBg: "linear-gradient(135deg, #2b2b2b 0%, #444444 100%)" },
};

export default function NotesPageLayout({ notes, config }: NotesPageLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeId = searchParams.get("id");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const searchResults = searchQuery.trim().length >= 2
    ? notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  // Recalculate dropdown position whenever it opens
  useEffect(() => {
    if (searchOpen && searchBoxRef.current) {
      const rect = searchBoxRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: Math.max(rect.width, 280) });
    }
  }, [searchOpen, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const active = document.documentElement.getAttribute("data-theme") as "light" | "dark" || "light";
    setThemeMode(active);
  }, []);

  const toggleThemeMode = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeMode(next);
  };

  // Track window scroll to sticky-adjust the floating sidebar top offset
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close sidebar on mobile after selecting a note
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
      setIsLocked(false);
    }
  }, [activeId]);

  const headerHeight = 70;
  const topOffset = Math.max(0, headerHeight - scrollY);

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768 && !isLocked) {
      setIsSidebarOpen(false);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger list hover events
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    setIsLocked(next);
  };

  const handleContentClick = () => {
    setIsSidebarOpen(false);
    setIsLocked(false);
  };

  const handleContentHover = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768 && !isLocked) {
      setIsSidebarOpen(false);
    }
  };

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const activeNote = sorted.find((n) => n.id === activeId) ?? sorted[0] ?? null;

  const cfg = (activeNote && activeNote.style) ? {
    bgEnabled: activeNote.style.bgEnabled ?? false,
    bgImageUrl: activeNote.style.bgImageUrl ?? null,
    bgOpacity: activeNote.style.bgOpacity ?? 15,
    heroEnabled: activeNote.style.heroEnabled ?? false,
    heroImageUrl: activeNote.style.heroImageUrl ?? null,
    heroHeight: 70,
    heroImageOpacity: activeNote.style.heroImageOpacity ?? 100,
    sidebarImageEnabled: activeNote.style.sidebarImageEnabled ?? false,
    sidebarImageUrl: activeNote.style.sidebarImageUrl ?? null,
    sidebarImageOpacity: activeNote.style.sidebarImageOpacity ?? 30,
    cornerTLEnabled: activeNote.style.cornerTLEnabled ?? false,
    cornerTLImageUrl: activeNote.style.cornerTLImageUrl ?? null,
    cornerTLSize: activeNote.style.cornerTLSize ?? 300,
    cornerTLFadeIntensity: activeNote.style.cornerTLFadeIntensity ?? 60,
    cornerTREnabled: activeNote.style.cornerTREnabled ?? false,
    cornerTRImageUrl: activeNote.style.cornerTRImageUrl ?? null,
    cornerTRSize: activeNote.style.cornerTRSize ?? 300,
    cornerTRFadeIntensity: activeNote.style.cornerTRFadeIntensity ?? 60,
    cornerBLEnabled: activeNote.style.cornerBLEnabled ?? false,
    cornerBLImageUrl: activeNote.style.cornerBLImageUrl ?? null,
    cornerBLSize: activeNote.style.cornerBLSize ?? 300,
    cornerBLFadeIntensity: activeNote.style.cornerBLFadeIntensity ?? 60,
    cornerBREnabled: activeNote.style.cornerBREnabled ?? false,
    cornerBRImageUrl: activeNote.style.cornerBRImageUrl ?? null,
    cornerBRSize: activeNote.style.cornerBRSize ?? 300,
    cornerBRFadeIntensity: activeNote.style.cornerBRFadeIntensity ?? 60,
    theme: activeNote.style.theme || "sky",
  } : (config ?? defaultNotesPageConfig());

  const theme = THEME_COLORS[cfg.theme] ?? THEME_COLORS.sky;

  return (
    <>
      {/* ═══ Global Background Bleed Layer ════════════════════════════════════ */}
      {cfg.bgEnabled && cfg.bgImageUrl && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cfg.bgImageUrl}
            alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: cfg.bgOpacity / 100,
            }}
          />
        </div>
      )}

      {/* ═══ Corner Art Elements ══════════════════════════════════════════════ */}
      {cfg.cornerTLEnabled && cfg.cornerTLImageUrl && (
        <CornerArt
          position="top-left"
          imageUrl={cfg.cornerTLImageUrl}
          size={cfg.cornerTLSize}
          fadeIntensity={cfg.cornerTLFadeIntensity}
        />
      )}
      {cfg.cornerTREnabled && cfg.cornerTRImageUrl && (
        <CornerArt
          position="top-right"
          imageUrl={cfg.cornerTRImageUrl}
          size={cfg.cornerTRSize}
          fadeIntensity={cfg.cornerTRFadeIntensity}
        />
      )}
      {cfg.cornerBLEnabled && cfg.cornerBLImageUrl && (
        <CornerArt
          position="bottom-left"
          imageUrl={cfg.cornerBLImageUrl}
          size={cfg.cornerBLSize}
          fadeIntensity={cfg.cornerBLFadeIntensity}
        />
      )}
      {cfg.cornerBREnabled && cfg.cornerBRImageUrl && (
        <CornerArt
          position="bottom-right"
          imageUrl={cfg.cornerBRImageUrl}
          size={cfg.cornerBRSize}
          fadeIntensity={cfg.cornerBRFadeIntensity}
        />
      )}

      {/* ═══ Page Shell ═══════════════════════════════════════════════════════ */}
      <div
        className="notes-standalone-page"
        style={{
          "--notes-accent": theme.accent,
          "--notes-accent-muted": theme.accentMuted,
          "--notes-hero-bg": theme.heroBg,
        } as React.CSSProperties}
      >
        {/* ── Topbar / Header ── */}
        <header
          className={`notes-topbar ${cfg.heroEnabled ? "notes-topbar-hero" : ""}`}
          style={cfg.heroEnabled ? { background: "var(--notes-hero-bg)" } : {}}
        >
          {/* Masked image aligned to the right side of the card */}
          {cfg.heroEnabled && cfg.heroImageUrl && (
            <div
              className="notes-hero-img-wrapper"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "60%",
                pointerEvents: "none",
                zIndex: 1,
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cfg.heroImageUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  opacity: cfg.heroImageOpacity / 100,
                }}
              />
            </div>
          )}
          
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 16 }}>
            {/* Title + subtitle */}
            <div>
              <h1 className="notes-topbar-title">Notes &amp; Logs</h1>
              <p className="notes-topbar-subtitle">Thoughts, experiments, and lessons.</p>
            </div>

            {/* ── Search Bar (inline next to title) ──────────────────────────────── */}
            <div ref={searchRef}>
              <div ref={searchBoxRef} className={`notes-search-box ${cfg.heroEnabled ? "hero-mode" : ""}`}>
                {/* Magnifying glass icon */}
                <svg
                  className="notes-search-icon"
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  id="notes-search-input"
                  className="notes-search-input"
                  type="text"
                  placeholder="Search notes…"
                  value={searchQuery}
                  autoComplete="off"
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={e => {
                    if (e.key === "Escape") {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }
                    if (e.key === "Enter" && searchResults.length > 0) {
                      router.push(`/notes?id=${searchResults[0].id}`);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    className="notes-search-clear"
                    onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                    aria-label="Clear search"
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Two-Panel Body ──────────────────────────────────────────────── */}
        <div className="notes-body" style={{ height: `calc(100vh - ${topOffset}px)` }}>
          {/* Left Sidebar — Note List */}
          <aside
            className={`notes-sidebar-panel ${!isSidebarOpen ? "collapsed" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              top: topOffset,
              height: `calc(100vh - ${topOffset}px)`,
              ...(cfg.sidebarImageEnabled && cfg.sidebarImageUrl
                ? { backgroundImage: `url(${cfg.sidebarImageUrl})` }
                : {})
            }}
          >
            {/* tint overlay on top of sidebar bg image */}
            {cfg.sidebarImageEnabled && cfg.sidebarImageUrl && (
              <div
                aria-hidden="true"
                className="notes-sidebar-tint"
                style={{ opacity: 1 - cfg.sidebarImageOpacity / 100 }}
              />
            )}
            <div className="notes-sidebar-inner">
              <NotesList notes={notes} activeId={activeId} />
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleThemeMode}
              className="theme-toggle"
              style={{ zIndex: 10 }}
              title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
            >
              {themeMode === "dark" ? (
                <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </aside>

          {/* Pull-tab — fixed to viewport left edge, slides with sidebar */}
          <button
            onClick={handleToggleClick}
            onMouseEnter={handleMouseEnter}
            className="notes-sidebar-toggle-tab"
            style={{
              left: isSidebarOpen ? "300px" : "0px",
              top: `calc(${topOffset}px + (100vh - ${topOffset}px) / 2)`
            }}
            title={isSidebarOpen ? "Close list" : "Open list"}
          >
            {isSidebarOpen ? (
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {/* Right Panel — Note Reader */}
          <main
            className="notes-reader-panel"
            onClick={handleContentClick}
            onMouseEnter={handleContentHover}
          >
            <NoteReader note={activeNote} />
          </main>
        </div>
      </div>

      {/* ── Search Dropdown Portal (fixed, escapes hero overflow:hidden) ── */}
      {searchOpen && dropdownPos && (searchResults.length > 0 || searchQuery.trim().length >= 2) && (
        <div
          className="notes-search-dropdown"
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 99999,
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((note, i) => (
              <button
                key={note.id}
                className="notes-search-result-item"
                style={{ animationDelay: `${i * 35}ms` }}
                onClick={() => {
                  router.push(`/notes?id=${note.id}`);
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: 13, height: 13, flexShrink: 0, opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="notes-search-result-title">{note.title}</span>
                {note.category && (
                  <span className="notes-search-result-category">{note.category}</span>
                )}
              </button>
            ))
          ) : (
            <div className="notes-search-no-results">
              No notes found for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      )}
    </>
  );
}
