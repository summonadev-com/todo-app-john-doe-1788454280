import { useState } from 'react';
import type { TaskDraft } from '@/types/task';

interface TaskInputProps {
  onAdd: (draft: TaskDraft) => boolean;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const canAdd = title.trim().length > 0;

  function submit() {
    if (!canAdd) return;
    const added = onAdd({ title, dueDate: dueDate || null });
    if (added) {
      setTitle('');
      setDueDate('');
    }
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="task-title" className="sr-only">
          Task title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
          className="w-full rounded-xl border border-transparent bg-slate-50 px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="task-due" className="sr-only">
          Due date (optional)
        </label>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="rounded-xl border border-transparent bg-slate-50 px-3 py-2.5 text-sm text-slate-600 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          type="submit"
          disabled={!canAdd}
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Add
        </button>
      </div>
    </form>
  );
}
