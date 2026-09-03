const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's local date as `YYYY-MM-DD`. */
export function todayISO(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/** True when the value is a well-formed, real calendar date in `YYYY-MM-DD` form. */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  return d <= daysInMonth;
}

/** Normalise arbitrary input into a valid date string or null. */
export function normalizeDate(value: unknown): string | null {
  return isValidDateString(value) ? value : null;
}

function toLocalDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Whole-day difference: date - today. Negative means in the past. */
export function dayDiffFromToday(value: string): number {
  const a = toLocalDate(value).getTime();
  const b = toLocalDate(todayISO()).getTime();
  return Math.round((a - b) / 86_400_000);
}

/** "Today" / "Tomorrow" / "Yesterday" / short formatted date. */
export function relativeDateLabel(value: string): string {
  if (!isValidDateString(value)) return '';
  const diff = dayDiffFromToday(value);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  const date = toLocalDate(value);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** Due strictly before today and not completed. */
export function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (completed || !isValidDateString(dueDate)) return false;
  return dayDiffFromToday(dueDate) < 0;
}
