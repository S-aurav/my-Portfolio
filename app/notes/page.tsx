import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import NotesContent from "@/components/NotesContent";
import { publicApi, NoteEntry } from "@/lib/api";

export const revalidate = 60;

export default async function NotesPage() {
  let notes: NoteEntry[] | null = null;
  try {
    const res = await publicApi.getNotes();
    if (res?.success && res?.data) {
      notes = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch notes on server:", err);
  }

  return (
    <div className="site-container">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <Suspense fallback={
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "var(--text-light)" }}>Loading...</p>
          </div>
        }>
          <NotesContent initialNotes={notes} />
        </Suspense>
      </main>
    </div>
  );
}
