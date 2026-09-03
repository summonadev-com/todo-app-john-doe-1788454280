---
status: implemented
title: Basic Personal Todo App with Due Dates
---

## Scope

A single-user, single-screen todo app for personal daily tasks. Add, complete, edit, delete tasks; each task may carry an optional due date with friendly cues ("Today", "Tomorrow", overdue). Tasks persist in browser local storage. Clean, minimal, light-mode visual style with one subtle accent color.

**Out of scope (future ideas):** priorities, tags/categories, search, drag-and-drop reordering, progress stats/charts, accounts/auth, cloud sync, recurring tasks, subtasks, notifications, dark mode.

## Data shape

A single `Task` entity, defined in `src/types/task.ts`:
1. `id` — stable unique string, generated at creation.
2. `title` — trimmed non-empty string.
3. `completed` — boolean.
4. `dueDate` — optional plain date string in `YYYY-MM-DD` form, or `null` when absent. Store as a plain date string (not a timestamp) so no timezone drift occurs.
5. `createdAt` — ISO timestamp string, used as the stable fallback sort key.

Also export a `TaskDraft`-style type for the shape accepted when creating a task, and a `TaskUpdate`-style partial type for edits.

## State & persistence

1. All task state lives in one custom hook, `src/hooks/useTasks.ts`, which owns the array of tasks and exposes `tasks`, `addTask`, `toggleTask`, `updateTask`, `deleteTask`, and `clearCompleted`.
2. Persistence goes through a small typed local-storage helper in `src/lib/storage.ts` with a single storage key (e.g. `todo.tasks.v1`). Reads must be defensive: wrap `JSON.parse` in try/catch, validate that the parsed value is an array, drop any entry that fails a shape check, and fall back to an empty list on any failure so corrupt storage never blanks the app with an error.
3. The hook loads once on mount and writes the full list back to storage whenever it changes. No backend, no fetching.
4. Date formatting/comparison helpers live in `src/lib/date.ts`: today's date as `YYYY-MM-DD`, a relative label function returning "Today" / "Tomorrow" / "Yesterday" / a short formatted date, and an `isOverdue` predicate (due date strictly before today **and** task not completed).

## Component breakdown

All under `src/components/`:
1. `TaskInput.tsx` — text field plus optional native date input plus an add button.
2. `TaskList.tsx` — renders a heading and a list of `TaskItem`s, or nothing when the group is empty.
3. `TaskItem.tsx` — checkbox, title, due-date badge, edit and delete affordances; switches into inline edit mode.
4. `DueDateBadge.tsx` — small pill showing the relative due-date label, styled neutral normally and accented/red when overdue.
5. `EmptyState.tsx` — friendly message shown when there are no tasks at all.

## UI layout (single main screen)

A centered column, max width around `max-w-xl`, generous vertical padding, neutral background (near-white), white card-free flat list, one accent color used only for the add button, checkboxes, and overdue emphasis.

Top to bottom: app title and a one-line subtitle → add-task row → "Active" list → "Completed" list (visually de-emphasised, strikethrough titles, collapsible or simply rendered below with a smaller heading and a "Clear completed" text button) → empty state replaces both lists when no tasks exist.

## Build phases

### Phase 1 — Project scaffold
1. Create the Vite + React + TypeScript project with `@tailwindcss/vite` and `@tanstack/router-plugin/vite` configured in `vite.config.ts`, and the `@/` alias pointing at `src/` in both `vite.config.ts` and `tsconfig.json`.
2. Create `src/styles/global.css` containing exactly `@import "tailwindcss";` and import it once in `src/main.tsx`.
3. Set up `src/main.tsx` to create the router from the generated `src/routeTree.gen.ts` and render it.
4. Create `src/routes/__root.tsx` as the app shell: page background, font smoothing, and an outlet.
5. Create `src/routes/index.tsx` as the todo screen route with placeholder content.

**Done when:** the dev server runs and `/` renders placeholder text with Tailwind styling applied.

### Phase 2 — Types, storage, and hook
1. Add `src/types/task.ts` with the task types described above.
2. Add `src/lib/storage.ts` with load/save helpers and defensive parsing.
3. Add `src/lib/date.ts` with today's-date, relative-label, and overdue helpers.
4. Add `src/hooks/useTasks.ts` wiring state to storage and exposing the mutation functions. `addTask` must reject empty/whitespace-only titles and trim titles before saving; `updateTask` must apply the same rule and leave the task unchanged if the new title is empty.

**Done when:** tasks can be added and mutated from the hook and survive a full page reload.

### Phase 3 — Core list UI
1. Build `TaskInput.tsx`: controlled text input, optional date input, submit on Enter or button click, clears both fields after a successful add, add button disabled while the title is blank.
2. Build `TaskItem.tsx` and `TaskList.tsx`: checkbox toggles completion, delete removes the task immediately.
3. Compose them in `src/routes/index.tsx`, splitting tasks into active and completed groups. Sort active tasks by due date ascending with undated tasks last, tie-broken by `createdAt`; sort completed tasks most-recent-first.

**Done when:** a task can be added, checked off, and deleted, and the grouping and ordering behave as described across reloads.

### Phase 4 — Due dates and editing
1. Build `DueDateBadge.tsx` and render it in `TaskItem.tsx` only when a due date exists.
2. Apply overdue emphasis to the badge and a subtle left-border or text accent on the task row.
3. Add inline editing to `TaskItem.tsx`: activate on double-click or an edit button, save on Enter or blur, cancel on Escape, and allow changing or clearing the due date while editing.

**Done when:** due-date labels read correctly for today/tomorrow/yesterday/other dates, overdue tasks are visibly flagged, and titles and due dates can both be edited and cleared.

### Phase 5 — Polish, empty states, and edge cases
1. Add `EmptyState.tsx` and show it when the task list is empty.
2. Show a lighter "Nothing active — nice work" style message when tasks exist but all are completed.
3. Add "Clear completed" wired to the hook, only rendered when at least one completed task exists.
4. Edge cases to handle explicitly: empty or whitespace-only input is rejected without an error state; long titles wrap rather than overflow (use wrapping/`break-words`, never truncation that hides content); missing due dates simply render no badge; a due date typed into the native input that the browser reports as invalid is treated as absent; completed tasks are never marked overdue.
5. Accessibility and interaction pass: label the text and date inputs, give icon-only buttons accessible names, ensure visible focus rings, and make the whole flow keyboard-operable.

**Done when:** every state (no tasks, all active, all completed, mixed, overdue, long titles) renders cleanly and the app is fully usable by keyboard.
