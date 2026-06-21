"use client";

import { useEffect, useState } from "react";
import { adminApi, ProjectEntry, ProjectFormData } from "@/lib/api";

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectEntry | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "UNLISTED">("PUBLIC");
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await adminApi.getAllProjects();
      setProjects(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setDate("");
    setGithubUrl("");
    setDemoUrl("");
    setTechStack("");
    setVisibility("PUBLIC");
    setDisplayOrder(0);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(project: ProjectEntry) {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setDate(project.date || "");
    setGithubUrl(project.githubUrl || "");
    setDemoUrl(project.demoUrl || "");
    setTechStack(project.techStack || "");
    setVisibility(project.visibility);
    setDisplayOrder(project.displayOrder);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const body: ProjectFormData = {
      title,
      description,
      date: date || null,
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      techStack: techStack || null,
      visibility,
      displayOrder,
    };

    try {
      if (editingProject) {
        await adminApi.updateProject(editingProject.id, body);
      } else {
        await adminApi.createProject(body);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await adminApi.deleteProject(id);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            Manage Projects
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Create and edit projects shown on your portfolio website
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
          onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover, #357ebd)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
        >
          + Add Project
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No projects added yet.</p>
          <button onClick={openCreateModal} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Create your first project →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map(project => (
            <div key={project.id} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {project.title}
                    </h3>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                      background: project.visibility === "PUBLIC" ? "rgba(72,187,120,0.12)" : project.visibility === "PRIVATE" ? "rgba(229,62,62,0.12)" : "rgba(128,90,213,0.12)",
                      color: project.visibility === "PUBLIC" ? "#48bb78" : project.visibility === "PRIVATE" ? "#e53e3e" : "#805ad5",
                    }}>
                      {project.visibility}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 8 }}>
                    {project.date || "No date"} · Order: {project.displayOrder}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => openEditModal(project)}
                    style={{
                      padding: "6px 12px", border: "1px solid var(--border-color)", borderRadius: 4,
                      background: "transparent", color: "var(--text-secondary)", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{
                      padding: "6px 12px", border: "1px solid #fed7d7", borderRadius: 4,
                      background: "transparent", color: "#e53e3e", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                {project.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(project.techStack || "").split(",").filter(Boolean).map(tag => (
                    <span key={tag} className="tag" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: "0.78rem" }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                      GitHub ↗
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                      Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          padding: 16,
        }}>
          <div className="card" style={{ width: "100%", maxWidth: 550, padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
              {editingProject ? "Edit Project" : "Add Project"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                  Title
                </label>
                <input
                  type="text" value={title} onChange={e => setTitle(e.target.value)} required
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                  Description
                </label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)} required rows={4}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Date / Year
                  </label>
                  <input
                    type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. August 2025"
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Display Order
                  </label>
                  <input
                    type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="e.g. React, Next.js, Spring Boot"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    GitHub URL
                  </label>
                  <input
                    type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://..."
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Demo URL
                  </label>
                  <input
                    type="url" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="https://..."
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                  Visibility
                </label>
                <select
                  value={visibility} onChange={e => setVisibility(e.target.value as any)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border-color)", borderRadius: 4, background: "#fff", color: "var(--text-primary)", outline: "none" }}
                >
                  <option value="PUBLIC">PUBLIC (Shown on home page)</option>
                  <option value="PRIVATE">PRIVATE (Hidden)</option>
                  <option value="UNLISTED">UNLISTED (Accessible by link)</option>
                </select>
              </div>

              {error && (
                <p style={{ fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4, padding: "8px 12px" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  style={{
                    padding: "9px 18px", border: "1px solid var(--border-color)", borderRadius: 4,
                    background: "transparent", color: "var(--text-muted)", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "9px 18px", background: "var(--accent)", color: "#fff",
                    border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600,
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
