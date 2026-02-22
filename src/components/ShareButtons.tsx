"use client";

import { JournalEntry } from "@/lib/types";
import { useState } from "react";

interface ShareButtonsProps {
  entry: JournalEntry;
}

export default function ShareButtons({ entry }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Create shareable text from entry
  const shareText = `"${entry.title}" - from my journal`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // Social share URLs
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-stone-200">
      <span className="text-xs text-stone-500 font-medium">Share:</span>

      {/* Twitter */}
      <button
        onClick={() => handleShare("twitter")}
        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
        title="Share on Twitter"
        aria-label="Share on Twitter"
      >
        <svg
          className="w-4 h-4 text-stone-600 hover:text-stone-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare("linkedin")}
        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg
          className="w-4 h-4 text-stone-600 hover:text-stone-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={() => handleShare("facebook")}
        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <svg
          className="w-4 h-4 text-stone-600 hover:text-stone-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-md hover:bg-stone-100 transition-colors"
        title="Copy link to clipboard"
        aria-label="Copy link to clipboard"
      >
        <svg
          className="w-4 h-4 text-stone-600 hover:text-stone-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </button>

      {/* Copied feedback */}
      {copied && (
        <span className="text-xs text-stone-600 ml-1">Copied!</span>
      )}
    </div>
  );
}
