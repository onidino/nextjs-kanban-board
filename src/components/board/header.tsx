'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { ColumnDialog } from '@/components/column-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function Header() {
  return (
    <div className="flex justify-between items-center p-8">
      <h1 className="text-3xl font-bold">Kanban Board</h1>
      <div className="flex items-center gap-4">
        <ColumnDialog
          trigger={
            <Button variant="outline" className="h-9 px-3">
              <Plus className="mr-2 h-4 w-4" />
              Add Column
            </Button>
          }
        />
        <ThemeToggle />
      </div>
    </div>
  );
} 