import type { ReactNode } from 'react';
import type { Task, TaskUpdate } from '@/types/task';
import { TaskItem } from '@/components/TaskItem';

interface TaskListProps {
  heading: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, update: TaskUpdate) => void;
  onDelete: (id: string) => void;
  action?: ReactNode;
}

export function TaskList({ heading, tasks, onToggle, onUpdate, onDelete, action }: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {heading}
          <span className="ml-2 font-medium text-slate-400 normal-case">{tasks.length}</span>
        </h2>
        {action}
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
