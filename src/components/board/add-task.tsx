'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';

interface AddTaskProps {
  columnId: number;
}

export function AddTask({ columnId }: AddTaskProps) {
  return (
    <TaskDialog
      columnId={columnId}
      trigger={
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      }
    />
  );
} 