"use client";

import dynamic from "next/dynamic";
import { SharedEntryData } from "@/lib/sharing";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface SharedEntryViewProps {
  data: SharedEntryData;
}

export default function SharedEntryView({ data }: SharedEntryViewProps) {
  const createdDate = new Date(data.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Read-only banner */}
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center justify-center gap-2">
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
          className="text-stone-500"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-stone-500">Read-only shared entry</span>
      </div>

      {/* Entry content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-stone-800 mb-2">
          {data.title || "Untitled"}
        </h1>
        <p className="text-xs text-stone-400 mb-8">{createdDate}</p>
        <div data-color-mode="light">
          <MDEditor
            value={data.content}
            preview="preview"
            hideToolbar
            visibleDragbar={false}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}
