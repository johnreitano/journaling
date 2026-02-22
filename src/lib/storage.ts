import { Folder, JournalEntry } from "./types";

const STORAGE_KEY = "journal-entries";
const FOLDERS_KEY = "journal-folders";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ── Entry functions ──────────────────────────────────────────────────────────

export function getAllEntries(): JournalEntry[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
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

export function createEntry(folderId?: string): JournalEntry {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    title: "Untitled",
    content: "",
    createdAt: now,
    updatedAt: now,
    ...(folderId ? { folderId } : {}),
  };
  saveEntry(entry);
  return entry;
}

// ── Folder functions ─────────────────────────────────────────────────────────

export function getAllFolders(): Folder[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(FOLDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Folder[];
  } catch {
    return [];
  }
}

export function saveFolder(folder: Folder): void {
  const folders = getAllFolders();
  const idx = folders.findIndex((f) => f.id === folder.id);
  if (idx >= 0) {
    folders[idx] = folder;
  } else {
    folders.push(folder);
  }
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function deleteFolder(id: string): void {
  const folders = getAllFolders().filter((f) => f.id !== id);
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));

  // Move entries that were in this folder to unfiled
  const entries = getAllEntries().map((e) =>
    e.folderId === id ? { ...e, folderId: undefined } : e
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createFolder(name: string): Folder {
  const folder: Folder = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
  saveFolder(folder);
  return folder;
}
