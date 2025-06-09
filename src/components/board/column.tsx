'use server';

import { Card } from '@/components/ui/card';
import { Task } from './task';
import { AddTask } from './add-task';
import { type Column as ColumnType, type Task as TaskType } from '@/lib/db/schema';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

export async function Column({ column, tasks }: ColumnProps) {
  return (
    <Card className="flex h-full w-[350px] flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
      <AddTask columnId={column.id} />
    </Card>
  );
} 