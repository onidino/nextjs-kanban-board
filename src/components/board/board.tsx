'use client';

import { getColumns, getTasks } from '@/lib/actions/board';
import { Column } from '.';
import { useState, useEffect } from 'react';
import { type Column as ColumnType, type Task as TaskType } from '@/lib/db/schema';

interface BoardProps {
  columns: ColumnType[];
  onColumnCreate: (column: ColumnType) => void;
  onColumnDelete: (columnId: number) => void;
}

export function Board({ columns: initialColumns, onColumnCreate, onColumnDelete }: BoardProps) {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [{ data: tasksData, error: tasksError }] = await Promise.all([
        getTasks()
      ]);

      if (tasksError) {
        setError(tasksError || 'Error loading board data');
        return;
      }

      if (tasksData) setTasks(tasksData);
    } catch (error) {
      setError('Error loading board data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Update columns when initialColumns changes
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const handleTaskMove = (taskId: number, targetColumnId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, columnId: targetColumnId }
          : task
      )
    );
  };

  const handleTaskCreate = (newTask: TaskType) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleTaskUpdate = (updatedTask: TaskType) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id 
          ? updatedTask
          : task
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">Loading board data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-3 p-12">
      <div className="flex gap-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks?.filter((task) => task.columnId === column.id) || []}
            onDelete={onColumnDelete}
            availableColumns={columns}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
          />
        ))}
      </div>
    </div>
  );
} 