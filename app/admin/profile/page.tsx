"use client";

import { useEffect, useState, useRef } from "react";
import { adminApi, ProfileEntry, ProfileFormData } from "@/lib/api";
import { personalInfo } from "@/lib/data";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)",
  background: "var(--bg-white)", color: "var(--text-primary)", outline: "none",
  fontSize: "0.88rem", fontFamily: "inherit", borderRadius: 0,
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.72rem", fontWeight: 700,
  color: "var(--text-muted)", letterSpacing: "0.08em",
  textTransform: "uppercase", marginBottom: 6,
};

const sectionLabels: Record<string, string> = {
  about: "About Section",
  skills: "Skills Section",
  experience: "Experience Section",
  projects: "Projects Section",
  notes: "Notes Section",
  contact: "Contact Section",
};

const defaultOrder = ["about", "skills", "experience", "projects", "notes", "contact"];

export default function AdminProfile() {
  const [form, setForm] = useState<ProfileFormData>({
    name: personalInfo.name,
    role: personalInfo.role,
    tagline: personalInfo.tagline,
    bio: personalInfo.bio,
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    profileImage: personalInfo.profileImage,
    githubUrl: personalInfo.links.github,
    linkedinUrl: personalInfo.links.linkedin,
    leetcodeUrl: personalInfo.links.leetcode,
    sectionOrder: "about,skills,experience,projects,notes,contact",
  });
  const [sections, setSections] = useState<string[]>(defaultOrder);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-dismiss error notification after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-dismiss success notification after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    adminApi.getProfile()
      .then(res => {
        if (res.data) {
          setForm({
            ...res.data,
            profileImage: res.data.profileImage || personalInfo.profileImage,
          });
          if (res.data.sectionOrder) {
            setSections(res.data.sectionOrder.split(",").map(s => s.trim()));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setSections(next);
    setForm(f => ({ ...f, sectionOrder: next.join(",") }));
  }

  function handleMoveDown(index: number) {
    if (index === sections.length - 1) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setSections(next);
    setForm(f => ({ ...f, sectionOrder: next.join(",") }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Max upload size reached (2MB limit). Please compress the image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError("");
    try {
      const res = await adminApi.uploadFile(file);
      setForm(f => ({ ...f, profileImage: res.data.url }));
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await adminApi.saveProfile(form);
      setSuccess("Profile saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>;



  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Profile</h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Edit your personal info — changes go live immediately</p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 16 : 24
        }}>
          {/* Left col */}
          <div className="card" style={{ padding: "28px 28px 20px" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Personal Info</h2>
            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Field label="Role / Title" name="role" value={form.role} onChange={handleChange} />
            <Field label="Location" name="location" value={form.location} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            <Field label="Tagline" name="tagline" textarea value={form.tagline} onChange={handleChange} />
            <Field label="Bio" name="bio" textarea value={form.bio} onChange={handleChange} />
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Profile Image */}
            <div className="card" style={{ padding: "28px 28px 20px" }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Profile Image</h2>

              {form.profileImage && (
                <div style={{ margin: "0 auto 16px", width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border-color)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Image URL</label>
                <input name="profileImage" value={form.profileImage} onChange={handleChange} style={inputStyle} placeholder="/profile.png or https://..." />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-light)", letterSpacing: "0.06em" }}>OR UPLOAD</span>
                <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ width: "100%", padding: "9px 16px", border: "1px solid var(--border-color)", background: "transparent", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-muted)", borderRadius: 0 }}
              >
                {uploading ? "Uploading…" : "Choose Image File"}
              </button>
            </div>

            {/* Social Links */}
            <div className="card" style={{ padding: "28px 28px 20px" }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Social Links</h2>
              <Field label="GitHub URL" name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} />
              <Field label="LinkedIn URL" name="linkedinUrl" type="url" value={form.linkedinUrl} onChange={handleChange} />
              <Field label="LeetCode URL" name="leetcodeUrl" type="url" value={form.leetcodeUrl} onChange={handleChange} />
            </div>

            {/* Homepage Layout Order */}
            <div className="card" style={{ padding: "28px 28px 20px" }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>Homepage Layout Order</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 16 }}>Use the arrows to re-order homepage sections</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sections.map((sec, idx) => (
                  <div key={sec} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", border: "1px solid var(--border-color)", background: "var(--bg-main)" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {sectionLabels[sec] || sec}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === 0 ? "not-allowed" : "pointer", background: "var(--bg-white)", color: "var(--text-primary)", border: "1px solid var(--border-color)", opacity: idx === 0 ? 0.4 : 1 }}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === sections.length - 1}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === sections.length - 1 ? "not-allowed" : "pointer", background: "var(--bg-white)", color: "var(--text-primary)", border: "1px solid var(--border-color)", opacity: idx === sections.length - 1 ? 0.4 : 1 }}
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Feedback Notifications */}
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1100, display: "flex", flexDirection: "column", gap: 10, maxWidth: "320px", width: "calc(100% - 48px)" }}>
          {error && (
            <div style={{ padding: "12px 16px", background: "var(--bg-white)", border: "1px solid var(--border-color)", borderLeft: "4px solid #e53e3e", boxShadow: "var(--shadow-md)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", animation: "fadeIn 0.2s ease-out" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#e53e3e", letterSpacing: "0.05em", textTransform: "uppercase" }}>Error</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", lineHeight: 1.4 }}>{error}</span>
              </div>
              <button type="button" onClick={() => setError("")} style={{ background: "transparent", border: "none", color: "var(--text-light)", fontSize: "1.15rem", cursor: "pointer", padding: "0 0 0 8px", lineHeight: 1 }}>×</button>
            </div>
          )}
          {success && (
            <div style={{ padding: "12px 16px", background: "var(--bg-white)", border: "1px solid var(--border-color)", borderLeft: "4px solid #276749", boxShadow: "var(--shadow-md)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", animation: "fadeIn 0.2s ease-out" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#276749", letterSpacing: "0.05em", textTransform: "uppercase" }}>Success</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", lineHeight: 1.4 }}>{success}</span>
              </div>
              <button type="button" onClick={() => setSuccess("")} style={{ background: "transparent", border: "none", color: "var(--text-light)", fontSize: "1.15rem", cursor: "pointer", padding: "0 0 0 8px", lineHeight: 1 }}>×</button>
            </div>
          )}
        </div>

        {/* Save */}
        <div style={isMobile ? {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 800,
          marginTop: 0
        } : {
          marginTop: 24,
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: isMobile ? "12px 24px" : "10px 32px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              fontFamily: "Josefin Sans, sans-serif",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              borderRadius: isMobile ? "24px" : 0,
              boxShadow: isMobile ? "0 4px 16px rgba(74, 144, 217, 0.45)" : "none"
            }}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function Field({ label, name, type = "text", textarea = false, value, onChange }: FieldProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {textarea
        ? <textarea name={name} value={value} onChange={onChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        : <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
      }
    </div>
  );
}
