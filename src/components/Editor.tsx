"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { JournalEntry, EntryColor } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const COLOR_BORDER_CLASSES: Record<EntryColor | string, string> = {
  red: "border-l-4 border-l-red-500",
  orange: "border-l-4 border-l-orange-500",
  yellow: "border-l-4 border-l-yellow-500",
  green: "border-l-4 border-l-green-500",
  blue: "border-l-4 border-l-blue-500",
  purple: "border-l-4 border-l-purple-500",
  null: "",
  undefined: "",
};

interface EditorProps {
  entry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
}

export default function Editor({ entry, onSave }: EditorProps) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [color, setColor] = useState<EntryColor>(entry.color ?? null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entryRef = useRef(entry);

  // Sync when switching entries
  useEffect(() => {
    setTitle(entry.title);
    setContent(entry.content);
    setColor(entry.color ?? null);
    entryRef.current = entry;
  }, [entry.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleSave = useCallback(
    (newTitle: string, newContent: string, newColor: EntryColor = color) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onSave({
          ...entryRef.current,
          title: newTitle,
          content: newContent,
          color: newColor,
          updatedAt: new Date().toISOString(),
        });
      }, 800);
    },
    [color, onSave]
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

  const handleColorChange = (newColor: EntryColor) => {
    setColor(newColor);
    scheduleSave(title, content, newColor);
  };

  const createdDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`flex flex-col h-full ${COLOR_BORDER_CLASSES[color || "null"]}`}>
      <div className="px-6 pt-6 pb-4 border-b border-stone-200">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex-1" />
          <ColorPicker selectedColor={color} onColorChange={handleColorChange} />
        </div>
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
