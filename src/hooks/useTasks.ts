import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task, TaskDraft, TaskUpdate } from '@/types/task';
import { loadTasks, saveTasks } from '@/lib/storage';
import { normalizeDate } from '@/lib/date';

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    setTasks(loadTasks());
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((draft: TaskDraft): boolean => {
    const title = draft.title.trim();
    if (!title) return false;
    const task: Task = {
      id: createId(),
      title,
      completed: false,
      dueDate: normalizeDate(draft.dueDate),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    return true;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }, []);

  const updateTask = useCallback((id: string, update: TaskUpdate) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const next: Task = { ...task };
        if (update.title !== undefined) {
          const title = update.title.trim();
          if (title) next.title = title;
        }
        if (update.dueDate !== undefined) next.dueDate = normalizeDate(update.dueDate);
        if (update.completed !== undefined) next.completed = update.completed;
        return next;
      }),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);

  return { tasks, addTask, toggleTask, updateTask, deleteTask, clearCompleted };
}
