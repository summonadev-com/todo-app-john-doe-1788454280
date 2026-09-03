export interface Task {
  id: string;
  title: string;
  completed: boolean;
  /** Plain date string `YYYY-MM-DD`, or null when absent. */
  dueDate: string | null;
  /** ISO timestamp string. */
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  dueDate?: string | null;
}

export interface TaskUpdate {
  title?: string;
  dueDate?: string | null;
  completed?: boolean;
}
