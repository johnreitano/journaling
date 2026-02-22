export type EntryColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | null;

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: EntryColor;
}
