'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { TaskDialog } from '@/components/task-dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export function Header() {
  return (
    <div className="flex justify-between items-center p-8">
      <h1 className="text-3xl font-bold">Kanban Board</h1>
      <div className="flex items-center gap-4">
        <TaskDialog
          onSubmit={(values) => {
            console.log("Creating task:", values);
          }}
          trigger={
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          }
        />
        <ThemeToggle />
      </div>
    </div>
  );
} 