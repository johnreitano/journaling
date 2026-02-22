"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { JournalEntry } from "@/lib/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditorProps {
  entry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
}

export default function Editor({ entry, onSave }: EditorProps) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entryRef = useRef(entry);

  // Sync when switching entries. Clear any pending debounced save first to
  // prevent the old entry's pending content from being written onto the new
  // entry once entryRef.current is updated.
  useEffect(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
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

  // Clear timer on unmount
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

  // Memoized so date formatting doesn't run on every keystroke
  const createdDate = useMemo(
    () =>
      new Date(entry.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [entry.createdAt]
  );

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
        <p className="text-xs text-stone-400 mt-1">{createdDate}</p>
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
