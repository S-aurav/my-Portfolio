"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  // Loading state (avoids SSR mismatch)
  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "Josefin Sans, sans-serif", fontSize: "0.85rem", letterSpacing: "0.06em" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
