'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <div className="flex justify-between items-center p-8">
      <h1 className="text-3xl font-bold">Kanban Board</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </div>
  );
} 