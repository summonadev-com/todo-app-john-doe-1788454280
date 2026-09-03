import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm font-medium tracking-wide text-slate-500">Todo app loading…</p>
    </div>
  );
}
