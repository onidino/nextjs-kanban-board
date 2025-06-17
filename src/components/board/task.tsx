'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssigneeSelect } from '@/components/assignee-select';
import { type Task as TaskType } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';

import { updateTask, updateTaskAssignee } from '@/lib/actions/task';
import { toast } from 'sonner';

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const taskForAssignee = {
    id: task.id,
    title: task.title,
    description: task.description || '',
    assignee: task.assignee ? {
      name: task.assignee,
      avatar: task.assignee.split(' ').map(n => n[0]).join('')
    } : {
      name: '',
      avatar: ''
    }
  };

  const handleAssigneeChange = async (assignee: string) => {
    const { error } = await updateTaskAssignee(task.id, assignee);
    if (error) {
      toast.error(error);
    }
  };

  const handleTaskUpdate = async (values: any) => {
    const { error } = await updateTask(task.id, {
      ...values,
      columnId: task.columnId,
    });
    
    if (error) {
      toast.error(error);
    }
  };
      
  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{task.title}</h4>
        <div className="flex items-center gap-2">
          <AssigneeSelect
            task={taskForAssignee}
            onAssigneeChange={handleAssigneeChange}
          />
          <TaskDialog
            task={taskForAssignee}
            columnId={task.columnId}

            trigger={
              <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}
    </Card>
  );
} 