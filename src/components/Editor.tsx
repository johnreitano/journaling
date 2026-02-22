"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Folder, JournalEntry } from "@/lib/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  entry: JournalEntry;
  folders: Folder[];
  onSave: (entry: JournalEntry) => void;
  onMoveToFolder: (entryId: string, folderId: string | undefined) => void;
}

export default function Editor({ entry, folders, onSave, onMoveToFolder }: EditorProps) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entryRef = useRef(entry);

  // Sync when switching entries
  useEffect(() => {
    setTitle(entry.title);
    setContent(entry.content);
    entryRef.current = entry;
  }, [entry.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onSave({
          ...entryRef.current,
          title: newTitle,
          content: newContent,
          updatedAt: new Date().toISOString(),
        });
      }, 800);
    },
    [onSave]
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    scheduleSave(newTitle, content);
  };

  const handleContentChange = (newContent: string | undefined) => {
    const val = newContent ?? "";
    setContent(val);
    scheduleSave(title, val);
  };

  const createdDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentFolder = folders.find((f) => f.id === entry.folderId);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b border-stone-200">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-2xl font-semibold text-stone-800 bg-transparent border-none outline-none placeholder:text-stone-300"
        />
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-stone-400">{createdDate}</p>
          {/* Folder selector */}
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <select
              value={entry.folderId ?? ""}
              onChange={(e) =>
                onMoveToFolder(entry.id, e.target.value || undefined)
              }
              className="text-xs text-stone-400 bg-transparent border-none outline-none cursor-pointer hover:text-stone-600 transition-colors"
              aria-label="Move to folder"
            >
              <option value="">Unfiled</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {currentFolder && (
              <span className="sr-only">(in {currentFolder.name})</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto" data-color-mode="light">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          preview="edit"
          height="100%"
          visibleDragbar={false}
          hideToolbar={false}
        />
      </div>
    </div>
  );
}
