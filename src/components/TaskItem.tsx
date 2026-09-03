import { useEffect, useRef, useState } from 'react';
import type { Task, TaskUpdate } from '@/types/task';
import { isOverdue } from '@/lib/date';
import { DueDateBadge } from '@/components/DueDateBadge';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, update: TaskUpdate) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDue, setDraftDue] = useState(task.dueDate ?? '');
  const titleRef = useRef<HTMLInputElement>(null);
  const overdue = isOverdue(task.dueDate, task.completed);

  useEffect(() => {
    if (editing) titleRef.current?.focus();
  }, [editing]);

  function startEditing() {
    setDraftTitle(task.title);
    setDraftDue(task.dueDate ?? '');
    setEditing(true);
  }

  function save() {
    if (!editing) return;
    setEditing(false);
    if (!draftTitle.trim()) {
      onUpdate(task.id, { dueDate: draftDue || null });
      return;
    }
    onUpdate(task.id, { title: draftTitle, dueDate: draftDue || null });
  }

  function cancel() {
    setEditing(false);
    setDraftTitle(task.title);
    setDraftDue(task.dueDate ?? '');
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-200 bg-white p-3 shadow-sm ring-2 ring-indigo-500/15">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={`edit-title-${task.id}`} className="sr-only">
            Edit task title
          </label>
          <input
            id={`edit-title-${task.id}`}
            ref={titleRef}
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                save();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                cancel();
              }
            }}
            className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2 text-[15px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <label htmlFor={`edit-due-${task.id}`} className="sr-only">
            Edit due date
          </label>
          <input
            id={`edit-due-${task.id}`}
            type="date"
            value={draftDue}
            onChange={(event) => setDraftDue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                save();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                cancel();
              }
            }}
            className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={cancel}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`group flex items-start gap-3 rounded-xl border bg-white p-3.5 shadow-sm transition ${
        overdue ? 'border-slate-200 border-l-4 border-l-rose-500' : 'border-slate-200'
      }`}
      onDoubleClick={startEditing}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-1"
      />

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`min-w-0 flex-1 text-[15px] break-words ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          }`}
        >
          {task.title}
        </span>
        {task.dueDate && <DueDateBadge dueDate={task.dueDate} overdue={overdue} />}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit "${task.title}"`}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
