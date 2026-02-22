"use client";

import { useState, useEffect, useCallback } from "react";
import { JournalEntry } from "@/lib/types";
import {
  getAllEntries,
  saveEntry,
  deleteEntry as removeEntry,
  createEntry,
} from "@/lib/storage";
import Sidebar from "./Sidebar";
import Editor from "./Editor";

export default function JournalApp() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = getAllEntries();
    const sorted = stored.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setEntries(sorted);
    if (sorted.length > 0) {
      setActiveEntryId(sorted[0].id);
    }
    setLoaded(true);
  }, []);

  const sortEntries = (list: JournalEntry[]) =>
    [...list].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const handleCreate = useCallback(() => {
    const entry = createEntry();
    setEntries((prev) => sortEntries([entry, ...prev]));
    setActiveEntryId(entry.id);
    setSidebarOpen(false);
  }, []);

  const handleSave = useCallback((updated: JournalEntry) => {
    saveEntry(updated);
    setEntries((prev) =>
      sortEntries(prev.map((e) => (e.id === updated.id ? updated : e)))
    );
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      removeEntry(id);
      setEntries((prev) => {
        const remaining = prev.filter((e) => e.id !== id);
        if (activeEntryId === id) {
          setActiveEntryId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
    },
    [activeEntryId]
  );

  const activeEntry = entries.find((e) => e.id === activeEntryId);

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-stone-50">
      <Sidebar
        entries={entries}
        activeEntryId={activeEntryId}
        isOpen={sidebarOpen}
        onSelect={setActiveEntryId}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-stone-200 transition-colors text-stone-500"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-medium text-stone-600">
            {activeEntry?.title || "Journal"}
          </span>
        </div>

        {/* Editor or empty state */}
        <div className="flex-1 overflow-hidden">
          {activeEntry ? (
            <Editor entry={activeEntry} onSave={handleSave} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4 text-stone-300"
              >
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
              </svg>
              <p className="text-sm">Create a new entry to start writing</p>
              <button
                onClick={handleCreate}
                className="mt-4 px-4 py-2 text-sm bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-700 transition-colors"
              >
                New Entry
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
