import { JournalEntry } from "./types";

const STORAGE_KEY = "journal-entries";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isValidEntry(entry: unknown): entry is JournalEntry {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.title === "string" &&
    typeof e.content === "string" &&
    typeof e.createdAt === "string" &&
    typeof e.updatedAt === "string"
  );
}

export function getAllEntries(): JournalEntry[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function getEntry(id: string): JournalEntry | undefined {
  return getAllEntries().find((e) => e.id === id);
}

export function saveEntry(entry: JournalEntry): void {
  const entries = getAllEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getAllEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createEntry(): JournalEntry {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    title: "Untitled",
    content: "",
    createdAt: now,
    updatedAt: now,
  };
  saveEntry(entry);
  return entry;
}
