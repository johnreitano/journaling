"use client";

import { useCallback } from "react";
import { JournalEntry } from "@/lib/types";
import SidebarEntry from "./SidebarEntry";

interface SidebarProps {
  entries: JournalEntry[];
  activeEntryId: string | null;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export default function Sidebar({
  entries,
  activeEntryId,
  isOpen,
  onSelect,
  onDelete,
  onCreate,
  onClose,
}: SidebarProps) {
  // Stable combined handler so memoized SidebarEntry children don't re-render
  // when only unrelated state (e.g. editor content) changes.
  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      onClose();
    },
    [onSelect, onClose]
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 bg-stone-50 border-r border-stone-200
          flex flex-col
          transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200">
          <h1 className="text-lg font-semibold text-stone-700 tracking-tight">
            Journal
          </h1>
          <button
            onClick={onCreate}
            className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-700"
            aria-label="New entry"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Entry list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {entries.length === 0 ? (
            <p className="text-sm text-stone-400 text-center mt-8 px-4">
              No entries yet. Tap + to start writing.
            </p>
          ) : (
            entries.map((entry) => (
              <SidebarEntry
                key={entry.id}
                entry={entry}
                isActive={entry.id === activeEntryId}
                onSelect={handleSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
