import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTasks } from '@/hooks/useTasks';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { EmptyState } from '@/components/EmptyState';
import type { Task } from '@/types/task';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function sortActive(a: Task, b: Task): number {
  if (a.dueDate !== b.dueDate) {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -1 : 1;
  }
  return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
}

function HomePage() {
  const { tasks, addTask, toggleTask, updateTask, deleteTask, clearCompleted } = useTasks();

  const active = useMemo(() => tasks.filter((t) => !t.completed).sort(sortActive), [tasks]);
  const completed = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)),
    [tasks],
  );

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-14 sm:py-20">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Today's list</h1>
        <p className="mt-1.5 text-[15px] text-slate-500">
          A simple place to keep track of what needs doing.
        </p>
      </header>

      <TaskInput onAdd={addTask} />

      {tasks.length === 0 && <EmptyState />}

      {tasks.length > 0 && active.length === 0 && (
        <p className="mt-10 rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200 ring-inset">
          Nothing active — nice work.
        </p>
      )}

      <TaskList
        heading="Active"
        tasks={active}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />

      <TaskList
        heading="Completed"
        tasks={completed}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        action={
          <button
            type="button"
            onClick={clearCompleted}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            Clear completed
          </button>
        }
      />
    </main>
  );
}
