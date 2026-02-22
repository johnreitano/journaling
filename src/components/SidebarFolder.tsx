"use client";

import { useState } from "react";
import { Folder, JournalEntry } from "@/lib/types";
import SidebarEntry from "./SidebarEntry";

interface SidebarFolderProps {
  folder: Folder;
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (id: string) => void;
  onDeleteEntry: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onCreateEntry: (folderId: string) => void;
}

export default function SidebarFolder({
  folder,
  entries,
  activeEntryId,
  onSelectEntry,
  onDeleteEntry,
  onRenameFolder,
  onDeleteFolder,
  onCreateEntry,
}: SidebarFolderProps) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(folder.name);

  const commitRename = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== folder.name) {
      onRenameFolder(folder.id, trimmed);
    } else {
      setNameInput(folder.name);
    }
    setEditing(false);
  };

  return (
    <div>
      {/* Folder row */}
      <div className="group flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-stone-100">
        {/* Expand/collapse arrow */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 text-stone-400 hover:text-stone-600 shrink-0"
          aria-label={expanded ? "Collapse folder" : "Expand folder"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Folder icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-stone-500 shrink-0"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>

        {/* Folder name or rename input */}
        {editing ? (
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setNameInput(folder.name);
                setEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 text-sm text-stone-700 bg-transparent outline-none border-b border-stone-400"
          />
        ) : (
          <span
            className="flex-1 min-w-0 text-sm font-medium text-stone-700 truncate cursor-pointer select-none"
            onClick={() => setExpanded(!expanded)}
            onDoubleClick={() => setEditing(true)}
          >
            {folder.name}
          </span>
        )}

        {/* Entry count */}
        {!editing && (
          <span className="text-xs text-stone-400 shrink-0 group-hover:hidden">
            {entries.length}
          </span>
        )}

        {/* Action buttons (visible on hover) */}
        {!editing && (
          <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateEntry(folder.id);
              }}
              className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600"
              aria-label="New entry in folder"
              title="New entry in folder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder.id);
              }}
              className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600"
              aria-label="Delete folder"
              title="Delete folder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Nested entries */}
      {expanded && (
        <div className="ml-5">
          {entries.length === 0 ? (
            <p className="text-xs text-stone-400 px-3 py-1.5 italic">
              No entries
            </p>
          ) : (
            entries.map((entry) => (
              <SidebarEntry
                key={entry.id}
                entry={entry}
                isActive={entry.id === activeEntryId}
                onSelect={onSelectEntry}
                onDelete={onDeleteEntry}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
