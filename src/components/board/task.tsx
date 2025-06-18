'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssigneeSelect } from '@/components/assignee-select';
import { type Task as TaskType, type Column as ColumnType } from '@/lib/db/schema';
import { type Task as TaskWithAssignee } from '@/components/assignee-select';
import { Button } from '@/components/ui/button';
import { PencilIcon, MoreVerticalIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { updateTask, updateTaskAssignee, deleteTask, moveTask } from '@/lib/actions/task';
import { toast } from 'sonner';

interface TaskProps {
  task: TaskType;
  onDelete?: (taskId: number) => void;
  availableColumns?: ColumnType[];
  onTaskMove?: (taskId: number, targetColumnId: number) => void;
  onTaskUpdate?: (task: TaskType) => void;
}

export function Task({ task, onDelete, availableColumns = [], onTaskMove, onTaskUpdate }: TaskProps) {
  const [currentTask, setCurrentTask] = useState(task);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      const updatedTask = { ...currentTask, assignee };
      setCurrentTask(updatedTask);
      onTaskUpdate?.(updatedTask);
    }
  };

  const handleTaskUpdate = (updatedTask: TaskWithAssignee) => {
    const newTask = {
      ...currentTask,
      title: updatedTask.title,
      description: updatedTask.description,
      assignee: updatedTask.assignee.name
    };
    setCurrentTask(newTask);
    onTaskUpdate?.(newTask);
  };

  const handleDeleteTask = async () => {
    try {
      const { error } = await deleteTask(currentTask.id);
      if (error) {
        throw new Error(error);
      }
      
      toast.success('Task deleted successfully');
      onDelete?.(currentTask.id);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleMoveTask = async (targetColumnId: number) => {
    try {
      const { error, data } = await moveTask(currentTask.id, targetColumnId);
      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        throw new Error('Failed to move task: No data returned');
      }
      
      toast.success('Task moved successfully');
      // Update local state through the callback
      onTaskMove?.(currentTask.id, targetColumnId);
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to move task');
    }
  };
      
  return (
    <>
      <Card className="flex flex-col gap-2 p-3">
        <div className="flex justify-between items-start">
          <h4 className="font-medium">{currentTask.title}</h4>
          <div className="flex items-center gap-2">
            <AssigneeSelect
              task={taskForAssignee}
              onAssigneeChange={handleAssigneeChange}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <TaskDialog
                  task={taskForAssignee}
                  columnId={currentTask.columnId}
                  onTaskUpdate={handleTaskUpdate}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    Move to
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {availableColumns
                        .filter(column => column.id !== currentTask.columnId)
                        .map(column => (
                          <DropdownMenuItem
                            key={column.id}
                            onSelect={() => handleMoveTask(column.id)}
                          >
                            {column.title}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setShowDeleteDialog(true)}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {currentTask.description && (
          <p className="text-sm text-muted-foreground">{currentTask.description}</p>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "{currentTask.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 