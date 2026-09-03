export function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-lg text-indigo-600">
        ✓
      </div>
      <p className="text-[15px] font-medium text-slate-700">Your list is empty</p>
      <p className="max-w-xs text-sm text-slate-500">
        Add your first task above. A due date is optional — you'll see "Today", "Tomorrow", or an
        overdue flag once one is set.
      </p>
    </div>
  );
}
