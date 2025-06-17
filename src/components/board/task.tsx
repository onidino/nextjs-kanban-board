'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssigneeSelect } from '@/components/assignee-select';
import { type Task as TaskType } from '@/lib/db/schema';
import { type Task as TaskWithAssignee } from '@/components/assignee-select';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { useState } from 'react';

import { updateTask, updateTaskAssignee } from '@/lib/actions/task';
import { toast } from 'sonner';

interface TaskProps {
  task: TaskType;
}

export function Task({ task }: TaskProps) {
  const [currentTask, setCurrentTask] = useState(task);

  const taskForAssignee = {
    id: currentTask.id,
    title: currentTask.title,
    description: currentTask.description || '',
    assignee: {
      name: currentTask.assignee || '',
      avatar: currentTask.assignee ? currentTask.assignee.split(' ').map(n => n[0]).join('') : ''
    }
  };

  const handleAssigneeChange = async (assignee: string) => {
    const { error } = await updateTaskAssignee(currentTask.id, assignee);
    if (error) {
      toast.error(error);
    } else {
      setCurrentTask(prev => ({ ...prev, assignee }));
    }
  };

  const handleTaskUpdate = (updatedTask: TaskWithAssignee) => {
    setCurrentTask(prev => ({
      ...prev,
      title: updatedTask.title,
      description: updatedTask.description,
      assignee: updatedTask.assignee.name
    }));
  };
      
  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{currentTask.title}</h4>
        <div className="flex items-center gap-2">
          <AssigneeSelect
            task={taskForAssignee}
            onAssigneeChange={handleAssigneeChange}
          />
          <TaskDialog
            task={taskForAssignee}
            columnId={currentTask.columnId}
            onTaskUpdate={handleTaskUpdate}
            trigger={
              <Button variant="ghost" size="icon">
                <PencilIcon className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      {currentTask.description && (
        <p className="text-sm text-muted-foreground">{currentTask.description}</p>
      )}
    </Card>
  );
} 