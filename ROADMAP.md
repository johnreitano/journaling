# Product Roadmap

This document outlines the planned feature development for the journaling app. Features are grouped into phases based on user value, technical complexity, and logical dependency ordering.

---

## Current State

The app is a client-side personal journaling tool built with Next.js, React, and TypeScript. It supports creating and editing markdown-based journal entries, auto-save, a responsive sidebar for navigation, and localStorage-based persistence.

---

## Phase 1 — Core Quality of Life

**Goal:** Make the existing experience more useful without changing the fundamental nature of the app. These are high-value, low-risk additions.

### 1.1 Search and Filter
- Full-text search across entry titles and content
- Filter by date range
- Results highlighted inline in sidebar

### 1.2 Entry Tags
- Add one or more free-form tags to any entry
- Filter sidebar by tag
- Tag autocomplete based on previously used tags

### 1.3 Writing Statistics
- Live word count and character count in the editor
- Reading time estimate
- Per-entry stats visible in sidebar and editor footer

### 1.4 Keyboard Shortcuts
- `Cmd/Ctrl + N` — new entry
- `Cmd/Ctrl + K` — open search
- `Cmd/Ctrl + S` — force save
- `Cmd/Ctrl + \` — toggle sidebar
- Shortcut reference accessible from UI

### 1.5 Entry Export
- Export individual entry as `.md` (Markdown) file
- Export individual entry as `.txt` (plain text)
- Export all entries as a `.zip` archive of `.md` files

---

## Phase 2 — Organization and Discovery

**Goal:** Help users manage a growing collection of entries. Once a user has dozens or hundreds of entries, discovery and organization become critical.

### 2.1 Favorites / Pinned Entries
- Star any entry to pin it to the top of the sidebar
- Toggle favorites filter to view only starred entries

### 2.2 Folders / Notebooks
- Group entries into named folders (e.g., "Work", "Travel", "Ideas")
- Entries belong to exactly one folder
- Sidebar collapses/expands folders
- Default "All Entries" view shows everything

### 2.3 Calendar View
- Monthly calendar showing days with at least one entry
- Click a day to view all entries written on that day
- Visual streak indicators for consecutive writing days

### 2.4 Mood / Emotion Tracking
- Optional mood selector per entry (emoji-based: 5 mood levels)
- Mood logged as structured metadata alongside entry content
- Filter sidebar by mood

### 2.5 Entry Templates
- Predefined entry structures (e.g., daily reflection, gratitude list, meeting notes)
- Users can create and save custom templates
- "New entry from template" option alongside standard new entry

---

## Phase 3 — Persistence and Sync

**Goal:** Move beyond localStorage to give users reliable, cross-device access to their data. This phase introduces a backend for the first time.

### 3.1 User Authentication
- Email + password sign-up and sign-in
- OAuth via Google (optional)
- Session management with secure cookies
- Account settings page (change password, delete account)

### 3.2 Cloud Storage Backend
- RESTful API (or tRPC) with a managed database (e.g., PostgreSQL via Supabase or PlanetScale)
- All entries stored server-side per user account
- Graceful migration path from localStorage to cloud on first sign-in

### 3.3 Cross-Device Sync
- Real-time or near-real-time sync across devices using the cloud backend
- Conflict resolution strategy for simultaneous edits (last-write-wins with version history)
- Offline support: queue writes locally when offline and sync on reconnect

### 3.4 Entry Version History
- Every save creates a versioned snapshot (up to 30 versions per entry)
- Users can browse and restore previous versions
- Diff view comparing any two versions

---

## Phase 4 — AI-Powered Features

**Goal:** Use AI to help users write more, reflect more deeply, and surface insights from their own writing over time.

### 4.1 Writing Prompts
- Daily prompt surfaced in the editor when starting a new entry
- Prompt library browsable by theme (gratitude, creativity, self-reflection, productivity)
- Option to dismiss or regenerate prompts

### 4.2 Entry Summarization
- AI-generated one- or two-sentence summary for each entry
- Summary displayed in the sidebar as an alternative to the raw content preview
- Generated on save; cached and not regenerated unless content changes significantly

### 4.3 Mood Inference
- Optional: automatically infer mood from entry text using AI
- Surfaced as a suggestion, user confirms or overrides
- Feeds into mood tracking (Phase 2.4)

### 4.4 Insights Dashboard
- Weekly and monthly writing statistics (entries written, words, streaks)
- Sentiment trend over time based on mood data
- Top recurring themes extracted from recent entries (keyword / topic clustering)
- "On this day" — entries from the same calendar date in prior years

### 4.5 Smart Search (Semantic)
- Supplement keyword search with semantic similarity search
- Example: searching "feeling anxious" surfaces entries about stress even if that exact phrase isn't present
- Powered by embedded vector representations of entry content

---

## Phase 5 — Sharing and Ecosystem

**Goal:** Extend the app beyond a private tool to support sharing, integrations, and a richer media experience.

### 5.1 Shareable Entry Links
- Generate a read-only public link for any entry
- Optional password protection on shared links
- Revoke access at any time
- Shared view is a clean reading layout with no editor chrome

### 5.2 Rich Media Support
- Inline image uploads (drag-and-drop or paste)
- Images stored in cloud object storage (e.g., S3 or Cloudflare R2)
- Image resizing and thumbnail generation

### 5.3 Voice Entry
- Record audio directly in the browser
- Transcribe to text using a speech-to-text API
- Audio recording optionally stored alongside the transcription

### 5.4 Reminders and Journaling Habits
- Set a daily reminder time (delivered via browser push notification or email)
- Customizable reminder message
- Habit streak tracking with visual indicator on the calendar

### 5.5 Third-Party Integrations
- Import from Day One (JSON export format)
- Import from Notion (Markdown export)
- Zapier / Webhook support: trigger an action when a new entry is created
- Optional read-only API for personal automation (e.g., sync to Obsidian vault)

---

## Prioritization Summary

| Phase | Focus Area              | Risk   | User Value |
|-------|-------------------------|--------|------------|
| 1     | Core quality of life    | Low    | High       |
| 2     | Organization/discovery  | Low    | High       |
| 3     | Persistence and sync    | High   | High       |
| 4     | AI-powered features     | Medium | Medium–High|
| 5     | Sharing and ecosystem   | Medium | Medium     |

Phases 1 and 2 can be shipped without any backend changes and carry minimal technical risk. Phase 3 is the biggest architectural shift and should be planned carefully before implementation begins. Phases 4 and 5 depend on the cloud backend from Phase 3.

---

## Out of Scope (for now)

- Native mobile app (iOS / Android) — revisit after Phase 3
- Collaborative editing / shared notebooks — revisit after Phase 5
- E2E encryption — important for privacy-sensitive users; evaluate after cloud backend is stable
