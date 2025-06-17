'use client';

import { Button } from '@/components/ui/button';
import { ColumnDialog } from '@/components/column-dialog';
import { PlusIcon } from 'lucide-react';
import { type Column } from '@/lib/db/schema';

interface HeaderProps {
  onColumnCreate?: (column: Column) => void;
}

export function Header({ onColumnCreate }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-xl font-semibold">Task Board</h1>
      <ColumnDialog
        onColumnUpdate={onColumnCreate}
        trigger={
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Column
          </Button>
        }
      />
    </header>
  );
} 