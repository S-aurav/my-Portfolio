"use client";

import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-main)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: "40px 36px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg style={{ width: 22, height: 22, color: "#fff" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            HQ Admin
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Sign in to your headquarters
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@hq.local"
              style={{
                width: "100%", padding: "9px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: 4, fontSize: "0.9rem",
                color: "var(--text-primary)", background: "#fff",
                outline: "none", fontFamily: "inherit",
                transition: "border-color 0.18s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%", padding: "9px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: 4, fontSize: "0.9rem",
                color: "var(--text-primary)", background: "#fff",
                outline: "none", fontFamily: "inherit",
                transition: "border-color 0.18s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          {error && (
            <p style={{ fontSize: "0.82rem", color: "#e53e3e", background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 4, padding: "8px 12px" }}>
              {error}
            </p>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px",
              background: loading ? "var(--text-muted)" : "var(--accent)",
              color: "#fff", border: "none", borderRadius: 4,
              fontSize: "0.85rem", fontWeight: 700,
              fontFamily: "Josefin Sans, sans-serif",
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.18s",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
