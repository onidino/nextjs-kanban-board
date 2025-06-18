'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { type Task as TaskType } from '@/lib/db/schema';

interface AddTaskProps {
  columnId: number;
  onTaskCreate?: (task: TaskType) => void;
}

export function AddTask({ columnId, onTaskCreate }: AddTaskProps) {
  return (
    <TaskDialog
      columnId={columnId}
      onTaskCreate={onTaskCreate}
      trigger={
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      }
    />
  );
} 