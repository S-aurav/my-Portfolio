"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { adminApi, NoteStyle, NoteStyleFormData } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Helper: a themed section card ─────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: 20, padding: "20px 24px" }}>
      <h2 style={{
        fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700,
        color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

// ── Helper: labeled toggle ─────────────────────────────────────────────────
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 14 }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 42, height: 24, borderRadius: 12,
          background: checked ? "var(--accent)" : "var(--border-color)",
          position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: checked ? 21 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }} />
      </div>
      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600, fontFamily: "Josefin Sans, sans-serif" }}>
        {label}
      </span>
    </label>
  );
}

// ── Helper: labeled text input ─────────────────────────────────────────────
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: "Josefin Sans, sans-serif" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 4,
          border: "1px solid var(--border-color)", background: "var(--bg-main)",
          color: "var(--text-primary)", fontSize: "0.88rem", fontFamily: "Inconsolata, monospace",
          outline: "none",
        }}
      />
    </div>
  );
}

// ── Helper: labeled slider ──────────────────────────────────────────────────
function Slider({ label, value, min, max, unit, hint, onChange }: {
  label: string; value: number; min: number; max: number;
  unit?: string; hint?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "Josefin Sans, sans-serif" }}>
          {label}
        </label>
        <span style={{ fontFamily: "Inconsolata, monospace", fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700 }}>
          {value}{unit ?? ""}
          {hint && <span style={{ color: "var(--text-light)", fontWeight: 400, marginLeft: 6, fontSize: "0.72rem" }}>{hint}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)" }}
      />
    </div>
  );
}

// ── Helper: corner config block ─────────────────────────────────────────────
function CornerBlock({
  label, enabled, imageUrl, size, fadeIntensity,
  onEnabledChange, onImageChange, onSizeChange, onFadeChange,
  onPickClick, onUploadClick
}: {
  label: string; enabled: boolean; imageUrl: string; size: number; fadeIntensity: number;
  onEnabledChange: (v: boolean) => void;
  onImageChange: (v: string) => void;
  onSizeChange: (v: number) => void;
  onFadeChange: (v: number) => void;
  onPickClick: () => void;
  onUploadClick: () => void;
}) {
  const fadeHint = fadeIntensity < 30 ? "Tight" : fadeIntensity < 60 ? "Medium" : fadeIntensity < 80 ? "Wide" : "Very Wide";
  return (
    <div style={{
      padding: "16px", borderRadius: 4, border: "1px solid var(--border-color)",
      background: enabled ? "rgba(74,144,217,0.03)" : "var(--bg-main)",
      transition: "all 0.2s", marginBottom: 12,
    }}>
      <Toggle label={label} checked={enabled} onChange={onEnabledChange} />
      {enabled && (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Field label="Image URL" value={imageUrl} onChange={onImageChange} placeholder="/imgs/blossom-sky.jpg" />
            </div>
            <button type="button" onClick={onPickClick}
              style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
              Pick 🖼️
            </button>
            <button type="button" onClick={onUploadClick}
              style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
              Upload 📤
            </button>
          </div>
          {imageUrl && (
            <div style={{ marginBottom: 12, borderRadius: 4, overflow: "hidden", height: 80 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <Slider label="Size" value={size} min={100} max={600} unit="px" onChange={onSizeChange} />
          <Slider label="Fade Intensity" value={fadeIntensity} min={10} max={90} unit="%" hint={`(${fadeHint})`} onChange={onFadeChange} />
        </>
      )}
    </div>
  );
}

// Previously contained BUNDLED_IMAGES, now removed in favor of dynamically loaded images.

const THEME_INFO = {
  sky: { label: "Sky Blue", color: "#5aa8d5" },
  floral: { label: "Floral Pink", color: "#b97ab3" },
  forest: { label: "Dark Forest", color: "#5a9e72" },
  neutral: { label: "Neutral", color: "#8a8a8a" },
};

export default function NotesStylesPage() {
  const [styles, setStyles] = useState<NoteStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<NoteStyle | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [bgEnabled, setBgEnabled] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(15);
  
  const [heroEnabled, setHeroEnabled] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageOpacity, setHeroImageOpacity] = useState(100);
  
  const [sidebarImageEnabled, setSidebarImageEnabled] = useState(false);
  const [sidebarImageUrl, setSidebarImageUrl] = useState("");
  const [sidebarImageOpacity, setSidebarImageOpacity] = useState(30);

  const [cornerTLEnabled, setCornerTLEnabled] = useState(false);
  const [cornerTLImageUrl, setCornerTLImageUrl] = useState("");
  const [cornerTLSize, setCornerTLSize] = useState(300);
  const [cornerTLFadeIntensity, setCornerTLFadeIntensity] = useState(60);

  const [cornerTREnabled, setCornerTREnabled] = useState(false);
  const [cornerTRImageUrl, setCornerTRImageUrl] = useState("");
  const [cornerTRSize, setCornerTRSize] = useState(300);
  const [cornerTRFadeIntensity, setCornerTRFadeIntensity] = useState(60);

  const [cornerBLEnabled, setCornerBLEnabled] = useState(false);
  const [cornerBLImageUrl, setCornerBLImageUrl] = useState("");
  const [cornerBLSize, setCornerBLSize] = useState(300);
  const [cornerBLFadeIntensity, setCornerBLFadeIntensity] = useState(60);

  const [cornerBREnabled, setCornerBREnabled] = useState(false);
  const [cornerBRImageUrl, setCornerBRImageUrl] = useState("");
  const [cornerBRSize, setCornerBRSize] = useState(300);
  const [cornerBRFadeIntensity, setCornerBRFadeIntensity] = useState(60);

  const [theme, setTheme] = useState<"sky" | "floral" | "forest" | "neutral" >("sky");

  const [uploading, setUploading] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute all unique uploaded images from existing styles
  const uploadedImages = useMemo(() => {
    const urls = new Set<string>();
    styles.forEach(s => {
      if (s.bgImageUrl) urls.add(s.bgImageUrl);
      if (s.heroImageUrl) urls.add(s.heroImageUrl);
      if (s.sidebarImageUrl) urls.add(s.sidebarImageUrl);
      if (s.cornerTLImageUrl) urls.add(s.cornerTLImageUrl);
      if (s.cornerTRImageUrl) urls.add(s.cornerTRImageUrl);
      if (s.cornerBLImageUrl) urls.add(s.cornerBLImageUrl);
      if (s.cornerBRImageUrl) urls.add(s.cornerBRImageUrl);
    });
    return Array.from(urls).map((url, i) => ({ label: `Uploaded ${i + 1}`, url }));
  }, [styles]);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchStyles();
  }, []);

  async function fetchStyles() {
    setLoading(true);
    try {
      const res = await adminApi.getAllNoteStyles();
      setStyles(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load style profiles");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingStyle(null);
    setName("");
    setBgEnabled(false);
    setBgImageUrl("");
    setBgOpacity(15);
    setHeroEnabled(false);
    setHeroImageUrl("");
    setHeroImageOpacity(100);
    setSidebarImageEnabled(false);
    setSidebarImageUrl("");
    setSidebarImageOpacity(30);
    setCornerTLEnabled(false);
    setCornerTLImageUrl("");
    setCornerTLSize(300);
    setCornerTLFadeIntensity(60);
    setCornerTREnabled(false);
    setCornerTRImageUrl("");
    setCornerTRSize(300);
    setCornerTRFadeIntensity(60);
    setCornerBLEnabled(false);
    setCornerBLImageUrl("");
    setCornerBLSize(300);
    setCornerBLFadeIntensity(60);
    setCornerBREnabled(false);
    setCornerBRImageUrl("");
    setCornerBRSize(300);
    setCornerBRFadeIntensity(60);
    setTheme("sky");
    setError(null);
    setModalOpen(true);
  }

  function openEditModal(style: NoteStyle) {
    setEditingStyle(style);
    setName(style.name);
    setBgEnabled(style.bgEnabled);
    setBgImageUrl(style.bgImageUrl || "");
    setBgOpacity(style.bgOpacity ?? 15);
    setHeroEnabled(style.heroEnabled);
    setHeroImageUrl(style.heroImageUrl || "");
    setHeroImageOpacity(style.heroImageOpacity ?? 100);
    setSidebarImageEnabled(style.sidebarImageEnabled);
    setSidebarImageUrl(style.sidebarImageUrl || "");
    setSidebarImageOpacity(style.sidebarImageOpacity ?? 30);
    setCornerTLEnabled(style.cornerTLEnabled);
    setCornerTLImageUrl(style.cornerTLImageUrl || "");
    setCornerTLSize(style.cornerTLSize ?? 300);
    setCornerTLFadeIntensity(style.cornerTLFadeIntensity ?? 60);
    setCornerTREnabled(style.cornerTREnabled);
    setCornerTRImageUrl(style.cornerTRImageUrl || "");
    setCornerTRSize(style.cornerTRSize ?? 300);
    setCornerTRFadeIntensity(style.cornerTRFadeIntensity ?? 60);
    setCornerBLEnabled(style.cornerBLEnabled);
    setCornerBLImageUrl(style.cornerBLImageUrl || "");
    setCornerBLSize(style.cornerBLSize ?? 300);
    setCornerBLFadeIntensity(style.cornerBLFadeIntensity ?? 60);
    setCornerBREnabled(style.cornerBREnabled);
    setCornerBRImageUrl(style.cornerBRImageUrl || "");
    setCornerBRSize(style.cornerBRSize ?? 300);
    setCornerBRFadeIntensity(style.cornerBRFadeIntensity ?? 60);
    setTheme(style.theme || "sky");
    setError(null);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this style profile? Notes using this style will fallback to the default theme.")) return;
    try {
      await adminApi.deleteNoteStyle(id);
      setStyles(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete style profile");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Profile Name is required");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: NoteStyleFormData = {
      name: name.trim(),
      bgEnabled,
      bgImageUrl: bgImageUrl.trim() || null,
      bgOpacity,
      heroEnabled,
      heroImageUrl: heroImageUrl.trim() || null,
      heroImageOpacity,
      sidebarImageEnabled,
      sidebarImageUrl: sidebarImageUrl.trim() || null,
      sidebarImageOpacity,
      cornerTLEnabled,
      cornerTLImageUrl: cornerTLImageUrl.trim() || null,
      cornerTLSize,
      cornerTLFadeIntensity,
      cornerTREnabled,
      cornerTRImageUrl: cornerTRImageUrl.trim() || null,
      cornerTRSize,
      cornerTRFadeIntensity,
      cornerBLEnabled,
      cornerBLImageUrl: cornerBLImageUrl.trim() || null,
      cornerBLSize,
      cornerBLFadeIntensity,
      cornerBREnabled,
      cornerBRImageUrl: cornerBRImageUrl.trim() || null,
      cornerBRSize,
      cornerBRFadeIntensity,
      theme,
    };

    try {
      if (editingStyle) {
        const res = await adminApi.updateNoteStyle(editingStyle.id, payload);
        if (res.success && res.data) {
          setStyles(prev => prev.map(s => s.id === editingStyle.id ? res.data! : s));
          setModalOpen(false);
        }
      } else {
        const res = await adminApi.createNoteStyle(payload);
        if (res.success && res.data) {
          setStyles(prev => [...prev, res.data!]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save style profile");
    } finally {
      setSaving(false);
    }
  }

  // File Upload Handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file);
      if (res.success && res.data?.url) {
        updateFieldByTarget(pickerTarget, res.data.url);
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setPickerTarget(null);
    }
  };

  const triggerUpload = (target: string) => {
    setPickerTarget(target);
    fileInputRef.current?.click();
  };

  const triggerGallery = (target: string) => {
    setPickerTarget(target);
  };

  const updateFieldByTarget = (target: string | null, url: string) => {
    if (!target) return;
    if (target === "bgImageUrl") setBgImageUrl(url);
    else if (target === "heroImageUrl") setHeroImageUrl(url);
    else if (target === "sidebarImageUrl") setSidebarImageUrl(url);
    else if (target === "cornerTLImageUrl") setCornerTLImageUrl(url);
    else if (target === "cornerTRImageUrl") setCornerTRImageUrl(url);
    else if (target === "cornerBLImageUrl") setCornerBLImageUrl(url);
    else if (target === "cornerBRImageUrl") setCornerBRImageUrl(url);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            Notes Style Profiles
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Create reusable botanical themes and layout profiles, and apply them when writing notes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            padding: "10px 20px", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 4, fontFamily: "Josefin Sans, sans-serif",
            fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.18s",
          }}
        >
          + Add Style Profile
        </button>
      </div>

      {/* Styles List */}
      {loading ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading style profiles...</p>
        </div>
      ) : styles.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No style profiles defined yet.</p>
          <button onClick={openCreateModal} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Create your first style profile →
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 20 }}>
          {styles.map(style => {
            const th = THEME_INFO[style.theme as keyof typeof THEME_INFO] || THEME_INFO.sky;
            return (
              <div key={style.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: `5px solid ${th.color}` }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {style.name}
                    </h3>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                      background: `${th.color}15`, color: th.color, textTransform: "uppercase"
                    }}>
                      🎨 {th.label}
                    </span>
                  </div>
                  
                  {/* Indicators */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {style.bgEnabled && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: "var(--bg-main)", color: "var(--text-secondary)" }}>🌌 Bg Bleed</span>}
                    {style.heroEnabled && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: "var(--bg-main)", color: "var(--text-secondary)" }}>🎞️ Hero Banner</span>}
                    {style.sidebarImageEnabled && <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: "var(--bg-main)", color: "var(--text-secondary)" }}>🪟 Sidebar Art</span>}
                    {(style.cornerTLEnabled || style.cornerTREnabled || style.cornerBLEnabled || style.cornerBREnabled) && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: "var(--bg-main)", color: "var(--text-secondary)" }}>
                        🌸 Corners: {[
                          style.cornerTLEnabled ? "TL" : "",
                          style.cornerTREnabled ? "TR" : "",
                          style.cornerBLEnabled ? "BL" : "",
                          style.cornerBREnabled ? "BR" : ""
                        ].filter(Boolean).join(",")}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: 12, marginTop: 12 }}>
                  <button
                    onClick={() => openEditModal(style)}
                    style={{
                      padding: "5px 12px", border: "1px solid var(--border-color)", borderRadius: 4,
                      background: "transparent", color: "var(--text-secondary)", fontSize: "0.72rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Edit Style
                  </button>
                  <button
                    onClick={() => handleDelete(style.id)}
                    style={{
                      padding: "5px 12px", border: "1px solid #fed7d7", borderRadius: 4,
                      background: "transparent", color: "#e53e3e", fontSize: "0.72rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Quick Gallery Picker Overlay */}
      {pickerTarget && !uploading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setPickerTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--bg-white)", borderRadius: 6, padding: 24,
            width: "min(600px, 92vw)", maxHeight: "80vh", overflowY: "auto",
            border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700, marginBottom: 16 }}>
              Pick a Botanical image:
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {uploadedImages.length > 0 ? (
                uploadedImages.map(img => (
                  <button
                    key={img.url}
                    onClick={() => {
                      updateFieldByTarget(pickerTarget, img.url);
                      setPickerTarget(null);
                    }}
                    style={{
                      border: "2px solid var(--border-color)", borderRadius: 4, overflow: "hidden",
                      cursor: "pointer", padding: 0, background: "none", textAlign: "left",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
                    <p style={{ padding: "4px 6px", fontSize: "0.68rem", fontFamily: "Josefin Sans, sans-serif", color: "var(--text-muted)" }}>
                      {img.label}
                    </p>
                  </button>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 20, color: "var(--text-light)" }}>
                  <p>No images have been uploaded to styles yet.</p>
                  <p style={{ fontSize: "0.8rem", marginTop: 4 }}>Upload an image from your device to see it here later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Uploader Overlay */}
      {uploading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div className="card" style={{ padding: "20px 40px", textAlign: "center" }}>
            <p style={{ fontWeight: 600 }}>Uploading image to Cloudinary...</p>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          padding: 16,
        }}>
          <div className="card" style={{ width: "96vw", maxWidth: "900px", height: "92vh", maxHeight: "92vh", padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {editingStyle ? "Edit Style Profile" : "Create Style Profile"}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: 8, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 20 }}>
                
                {/* Profile Name & Theme */}
                <div style={{ padding: 16, borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-main)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <Field label="Style Profile Name" value={name} onChange={setName} placeholder="e.g. Autumn Forest, Minimalist Floral" />
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8, fontFamily: "Josefin Sans, sans-serif" }}>
                      Accent Color Theme
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10 }}>
                      {(Object.keys(THEME_INFO) as Array<keyof typeof THEME_INFO>).map((t) => {
                        const info = THEME_INFO[t];
                        const borderActive = theme === t ? `2px solid ${info.color}` : "1px solid var(--border-color)";
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTheme(t)}
                            style={{
                              padding: "10px",
                              borderRadius: 4,
                              border: borderActive,
                              background: theme === t ? `${info.color}15` : "var(--bg-white)",
                              color: "var(--text-primary)",
                              fontFamily: "Josefin Sans, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                            }}
                          >
                            <span style={{ width: 12, height: 12, borderRadius: "50%", background: info.color }} />
                            {info.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Background Bleed */}
                <div style={{ padding: 16, borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
                  <Toggle label="Enable Decorative Background Bleed" checked={bgEnabled} onChange={setBgEnabled} />
                  {bgEnabled && (
                    <>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <Field label="Background Image URL" value={bgImageUrl} onChange={setBgImageUrl} placeholder="/imgs/blossom-sky.jpg" />
                        </div>
                        <button type="button" onClick={() => triggerGallery("bgImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Pick 🖼️
                        </button>
                        <button type="button" onClick={() => triggerUpload("bgImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Upload 📤
                        </button>
                      </div>
                      {bgImageUrl && (
                        <div style={{ height: 80, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={bgImageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <Slider label="Background Bleed Opacity" value={bgOpacity} min={5} max={80} unit="%" hint="(lower = more subtle)" onChange={setBgOpacity} />
                    </>
                  )}
                </div>

                {/* Hero Art Banner */}
                <div style={{ padding: 16, borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
                  <Toggle label="Enable Hero Art Banner (70px Height)" checked={heroEnabled} onChange={setHeroEnabled} />
                  {heroEnabled && (
                    <>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <Field label="Hero Banner Image URL" value={heroImageUrl} onChange={setHeroImageUrl} placeholder="/imgs/red-leaves-sun.jpg" />
                        </div>
                        <button type="button" onClick={() => triggerGallery("heroImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Pick 🖼️
                        </button>
                        <button type="button" onClick={() => triggerUpload("heroImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Upload 📤
                        </button>
                      </div>
                      {heroImageUrl && (
                        <div style={{ height: 80, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={heroImageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <Slider label="Hero Art Visibility" value={heroImageOpacity} min={10} max={100} unit="%" hint="(higher = more visible)" onChange={setHeroImageOpacity} />
                    </>
                  )}
                </div>

                {/* Sidebar Drawer Art */}
                <div style={{ padding: 16, borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
                  <Toggle label="Enable Sidebar Drawer Art" checked={sidebarImageEnabled} onChange={setSidebarImageEnabled} />
                  {sidebarImageEnabled && (
                    <>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <Field label="Sidebar Image URL" value={sidebarImageUrl} onChange={setSidebarImageUrl} placeholder="/imgs/flowers-blue.jpg" />
                        </div>
                        <button type="button" onClick={() => triggerGallery("sidebarImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Pick 🖼️
                        </button>
                        <button type="button" onClick={() => triggerUpload("sidebarImageUrl")}
                          style={{ padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "var(--bg-white)", cursor: "pointer", fontSize: "0.78rem", color: "var(--accent)", fontFamily: "Josefin Sans, sans-serif", marginBottom: 14 }}>
                          Upload 📤
                        </button>
                      </div>
                      {sidebarImageUrl && (
                        <div style={{ height: 80, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sidebarImageUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <Slider label="Sidebar Drawer Art Opacity" value={sidebarImageOpacity} min={5} max={80} unit="%" hint="(lower = more subtle)" onChange={setSidebarImageOpacity} />
                    </>
                  )}
                </div>

                {/* Corner Art Customization */}
                <div style={{ padding: 16, borderRadius: 4, border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Josefin Sans, sans-serif" }}>
                    Corner Art Illustrations
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                    <CornerBlock
                      label="Top-Left Corner Illustration"
                      enabled={cornerTLEnabled}
                      imageUrl={cornerTLImageUrl}
                      size={cornerTLSize}
                      fadeIntensity={cornerTLFadeIntensity}
                      onEnabledChange={setCornerTLEnabled}
                      onImageChange={setCornerTLImageUrl}
                      onSizeChange={setCornerTLSize}
                      onFadeChange={setCornerTLFadeIntensity}
                      onPickClick={() => triggerGallery("cornerTLImageUrl")}
                      onUploadClick={() => triggerUpload("cornerTLImageUrl")}
                    />
                    <CornerBlock
                      label="Top-Right Corner Illustration"
                      enabled={cornerTREnabled}
                      imageUrl={cornerTRImageUrl}
                      size={cornerTRSize}
                      fadeIntensity={cornerTRFadeIntensity}
                      onEnabledChange={setCornerTREnabled}
                      onImageChange={setCornerTRImageUrl}
                      onSizeChange={setCornerTRSize}
                      onFadeChange={setCornerTRFadeIntensity}
                      onPickClick={() => triggerGallery("cornerTRImageUrl")}
                      onUploadClick={() => triggerUpload("cornerTRImageUrl")}
                    />
                    <CornerBlock
                      label="Bottom-Left Corner Illustration"
                      enabled={cornerBLEnabled}
                      imageUrl={cornerBLImageUrl}
                      size={cornerBLSize}
                      fadeIntensity={cornerBLFadeIntensity}
                      onEnabledChange={setCornerBLEnabled}
                      onImageChange={setCornerBLImageUrl}
                      onSizeChange={setCornerBLSize}
                      onFadeChange={setCornerBLFadeIntensity}
                      onPickClick={() => triggerGallery("cornerBLImageUrl")}
                      onUploadClick={() => triggerUpload("cornerBLImageUrl")}
                    />
                    <CornerBlock
                      label="Bottom-Right Corner Illustration"
                      enabled={cornerBREnabled}
                      imageUrl={cornerBRImageUrl}
                      size={cornerBRSize}
                      fadeIntensity={cornerBRFadeIntensity}
                      onEnabledChange={setCornerBREnabled}
                      onImageChange={setCornerBRImageUrl}
                      onSizeChange={setCornerBRSize}
                      onFadeChange={setCornerBRFadeIntensity}
                      onPickClick={() => triggerGallery("cornerBRImageUrl")}
                      onUploadClick={() => triggerUpload("cornerBRImageUrl")}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4, padding: "8px 12px", margin: "10px 0" }}>
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12, borderTop: "1px solid var(--border-color)", paddingTop: 16 }}>
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 16px", border: "1px solid var(--border-color)", borderRadius: 4,
                    background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "8px 16px", background: "var(--accent)", color: "#fff",
                    border: "none", borderRadius: 4, cursor: saving ? "default" : "pointer", fontWeight: 600, fontSize: "0.8rem",
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? "Saving..." : "Save Style Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
