"use client";

import { JournalEntry } from "@/lib/types";

interface SidebarEntryProps {
  entry: JournalEntry;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SidebarEntry({
  entry,
  isActive,
  onSelect,
  onDelete,
}: SidebarEntryProps) {
  const date = new Date(entry.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const preview = entry.content
    .replace(/[#*_`~>\-\[\]()!]/g, "")
    .slice(0, 60)
    .trim();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(entry.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(entry.id);
      }}
      className={`group w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
        isActive
          ? "bg-stone-200/70"
          : "hover:bg-stone-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-800 truncate">
            {entry.title || "Untitled"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-stone-400 shrink-0">{date}</span>
            {preview && (
              <span className="text-xs text-stone-400 truncate">{preview}</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-stone-300/50 transition-opacity text-stone-400 hover:text-stone-600 shrink-0 mt-0.5"
          aria-label="Delete entry"
        >
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
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
