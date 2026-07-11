import { Suspense } from "react";
import { publicApi, NoteEntry, NotesPageConfig } from "@/lib/api";
import NotesPageLayout from "@/components/notes/NotesPageLayout";

export const revalidate = 60;

export const metadata = {
  title: "Notes & Logs",
  description: "Personal notes, engineering logs, and knowledge snippets.",
};

export default async function NotesPage() {
  let notes: NoteEntry[] = [];
  let config: NotesPageConfig | null = null;

  try {
    const [notesRes, configRes] = await Promise.allSettled([
      publicApi.getNotes(),
      publicApi.getNotesConfig(),
    ]);

    if (notesRes.status === "fulfilled" && notesRes.value?.success) {
      notes = notesRes.value.data ?? [];
    }
    if (configRes.status === "fulfilled" && configRes.value?.success) {
      config = configRes.value.data ?? null;
    }
  } catch (err) {
    console.error("Failed to fetch notes page data:", err);
  }

  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--text-light)", fontFamily: "Josefin Sans, sans-serif" }}>Loading…</p>
        </div>
      }
    >
      <NotesPageLayout notes={notes} config={config} />
    </Suspense>
  );
}
