'use client';

import { Card } from '@/components/ui/card';
import { Task } from './task';
import { AddTask } from './add-task';
import { type Column as ColumnType, type Task as TaskType } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { PencilIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { ColumnDialog } from '@/components/column-dialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { deleteColumn } from '@/lib/actions/board';
import { toast } from 'sonner';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onDelete?: (columnId: number) => void;
  availableColumns?: ColumnType[];
  onTaskMove?: (taskId: number, targetColumnId: number) => void;
  onTaskCreate?: (task: TaskType) => void;
  onTaskDelete?: (taskId: number) => void;
  onTaskUpdate?: (task: TaskType) => void;
}

export function Column({ column: initialColumn, tasks, onDelete, availableColumns = [], onTaskMove, onTaskCreate, onTaskDelete, onTaskUpdate }: ColumnProps) {
  const [column, setColumn] = useState(initialColumn);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleColumnUpdate = (updatedColumn: ColumnType) => {
    setColumn(updatedColumn);
  };

  const handleDeleteColumn = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteColumn(column.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success('Column deleted successfully');
      onDelete?.(column.id);
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete column');
      // Don't close the dialog on error
      return;
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="flex h-full w-[350px] flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{column.title}</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              {tasks.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ColumnDialog
                  column={column}
                  onColumnUpdate={handleColumnUpdate}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
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
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {tasks.map((task) => (
            <Task 
              key={task.id} 
              task={task} 
              onDelete={onTaskDelete}
              availableColumns={availableColumns}
              onTaskMove={onTaskMove}
              onTaskUpdate={onTaskUpdate}
            />
          ))}
        </div>
        <AddTask columnId={column.id} onTaskCreate={onTaskCreate} />
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {tasks.length > 0 ? (
                <>
                  <span className="text-destructive">
                    This column contains {tasks.length} task{tasks.length === 1 ? '' : 's'}.
                  </span>
                  {' '}You must remove all tasks before deleting this column.
                </>
              ) : (
                <>
                  This action cannot be undone. This will permanently delete the column
                  "{column.title}".
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            {tasks.length === 0 && (
              <AlertDialogAction
                onClick={handleDeleteColumn}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 