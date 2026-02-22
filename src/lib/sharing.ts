import { JournalEntry } from "./types";

export interface SharedEntryData {
  title: string;
  content: string;
  createdAt: string;
}

export function encodeEntryForSharing(entry: JournalEntry): string {
  const data: SharedEntryData = {
    title: entry.title,
    content: entry.content,
    createdAt: entry.createdAt,
  };
  const json = JSON.stringify(data);
  // unescape/encodeURIComponent handles unicode characters safely
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeSharedEntry(encoded: string): SharedEntryData | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json) as SharedEntryData;
  } catch {
    return null;
  }
}
