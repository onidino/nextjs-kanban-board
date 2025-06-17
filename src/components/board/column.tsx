'use client';

import { Card } from '@/components/ui/card';
import { Task } from './task';
import { AddTask } from './add-task';
import { type Column as ColumnType, type Task as TaskType } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { ColumnDialog } from '@/components/column-dialog';
import { useState } from 'react';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

export function Column({ column: initialColumn, tasks }: ColumnProps) {
  const [column, setColumn] = useState(initialColumn);

  const handleColumnUpdate = (updatedColumn: ColumnType) => {
    setColumn(updatedColumn);
  };

  return (
    <Card className="flex h-full w-[350px] flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{column.title}</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
            {tasks.length}
          </span>
          <ColumnDialog
            column={column}
            onColumnUpdate={handleColumnUpdate}
            trigger={
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={`Edit column "${column.title}"`}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
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