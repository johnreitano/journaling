"use client";

import { useState } from "react";
import { Folder, JournalEntry } from "@/lib/types";
import SidebarEntry from "./SidebarEntry";
import SidebarFolder from "./SidebarFolder";

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  activeEntryId: string | null;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (folderId?: string) => void;
  onClose: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
}

export default function Sidebar({
  entries,
  folders,
  activeEntryId,
  isOpen,
  onSelect,
  onDelete,
  onCreate,
  onClose,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: SidebarProps) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const unfiledEntries = entries.filter((e) => !e.folderId);
  const folderEntries = (folderId: string) =>
    entries.filter((e) => e.folderId === folderId);

  const submitNewFolder = () => {
    const name = newFolderName.trim();
    if (name) {
      onCreateFolder(name);
    }
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const handleSelectAndClose = (id: string) => {
    onSelect(id);
    onClose();
  };

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
          <div className="flex items-center gap-1">
            {/* New folder button */}
            <button
              onClick={() => {
                setCreatingFolder(true);
                setNewFolderName("");
              }}
              className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-700"
              aria-label="New folder"
              title="New folder"
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
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
            {/* New entry button */}
            <button
              onClick={() => onCreate()}
              className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-700"
              aria-label="New entry"
              title="New entry"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {/* New folder input */}
          {creatingFolder && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
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
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={submitNewFolder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitNewFolder();
                  if (e.key === "Escape") {
                    setCreatingFolder(false);
                    setNewFolderName("");
                  }
                }}
                placeholder="Folder name"
                className="flex-1 min-w-0 text-sm text-stone-700 bg-transparent outline-none border-b border-stone-400 placeholder:text-stone-300"
              />
            </div>
          )}

          {/* Folders */}
          {folders.map((folder) => (
            <SidebarFolder
              key={folder.id}
              folder={folder}
              entries={folderEntries(folder.id)}
              activeEntryId={activeEntryId}
              onSelectEntry={handleSelectAndClose}
              onDeleteEntry={onDelete}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              onCreateEntry={(folderId) => {
                onCreate(folderId);
              }}
            />
          ))}

          {/* Unfiled entries */}
          {unfiledEntries.length > 0 && (
            <div>
              {folders.length > 0 && (
                <div className="px-2 pt-2 pb-1 text-xs font-medium text-stone-400 uppercase tracking-wide">
                  Unfiled
                </div>
              )}
              {unfiledEntries.map((entry) => (
                <SidebarEntry
                  key={entry.id}
                  entry={entry}
                  isActive={entry.id === activeEntryId}
                  onSelect={handleSelectAndClose}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {entries.length === 0 && folders.length === 0 && !creatingFolder && (
            <p className="text-sm text-stone-400 text-center mt-8 px-4">
              No entries yet. Tap + to start writing.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
