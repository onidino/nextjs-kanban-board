'use server';

import { Card } from '@/components/ui/card';
import { type Task as TaskType } from '@/lib/db/schema';

interface TaskProps {
  task: TaskType;
}

export async function Task({ task }: TaskProps) {
  return (
    <Card className="flex flex-col gap-2 p-3">
      <h4 className="font-medium">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}
    </Card>
  );
} 