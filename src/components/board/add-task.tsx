'use server';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddTaskProps {
  columnId: number;
}

export async function AddTask({ columnId }: AddTaskProps) {
  return (
    <Button variant="outline" className="w-full">
      <Plus className="mr-2 h-4 w-4" />
      Add Task
    </Button>
  );
} 