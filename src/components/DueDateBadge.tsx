import { relativeDateLabel } from '@/lib/date';

interface DueDateBadgeProps {
  dueDate: string;
  overdue: boolean;
}

export function DueDateBadge({ dueDate, overdue }: DueDateBadgeProps) {
  const label = relativeDateLabel(dueDate);
  if (!label) return null;

  return (
    <span
      className={
        overdue
          ? 'inline-flex shrink-0 items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 ring-inset'
          : 'inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'
      }
    >
      {overdue ? `Overdue · ${label}` : label}
    </span>
  );
}
